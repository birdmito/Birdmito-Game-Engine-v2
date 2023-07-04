import { GameObject } from "../../engine";
import { BitmapRenderer } from "../BitmapRenderer";
import { TextRenderer } from "../TextRenderer";
import { Transform } from "../Transform";
import { System } from "./System";

export class AnchorSystem extends System{
    onStart(): void {
        this.calculateContainerBound(this.rootGameObject)
        this.calculateContainerBound(this.gameEngine.editorGameObject)
    }
    onUpdate(): void {
        // 切换场景不会重新调用onStart
        // 切换场景时不会计算容器边界的本质原因是：场景切换不是真的切换场景，而是更换sceneRoot的子节点，而System的onStart只会在引擎开始时调用一次
        // 包围盒计算也不应该在onUpdate中进行，因为onUpdate是每帧都会调用的，这样会导致每帧都会计算一次包围盒，从而导致性能问题以及由包围盒变化引起的bug
        // 另外，场景中新生成的GameObject也不会调用onStart，所以也不会计算包围盒
        // this.calculateContainerBound(this.rootGameObject)
        // this.calculateContainerBound(this.gameEngine.editorGameObject)
    }

    calculateContainerBound(gameObject: GameObject) :{minX: number, minY: number, maxX: number, maxY: number}{
        // calculateContainerBound
        //     计算计算锚点所需要的边界，应当递归实现
        //     每次递归计算返回的坐标应当是相对于父节点的坐标，并且用于父节点计算他的最远边界
        //     递归计算的时候，应当先计算子节点的边界，再计算自己的边界
        const transform = gameObject.getBehaviour(Transform)
        var minX = transform.x
        var minY = transform.y
        var maxX = transform.x
        var maxY = transform.y
        if(gameObject.getBehaviour(BitmapRenderer)){
            const bound = this.calculateBitmapBound(gameObject)
            minX = Math.min(minX, bound.minX)
            minY = Math.min(minY, bound.minY)
            maxX = Math.max(maxX, bound.maxX)
            maxY = Math.max(maxY, bound.maxY)
            // console.log(`bitmap ${gameObject.getBehaviour(BitmapRenderer).source}`)
            // console.log({minX, minY, maxX, maxY})
        }
        else if(gameObject.getBehaviour(TextRenderer)){
            const bound = this.calculateTextBound(gameObject)
            minX = Math.min(minX, bound.minX)
            minY = Math.min(minY, bound.minY)
            maxX = Math.max(maxX, bound.maxX)
            maxY = Math.max(maxY, bound.maxY)
        }
        
        for(const child of gameObject.children){
            const childBound = this.calculateContainerBound(child)

            minX = Math.min(minX, childBound.minX * transform.scaleX + transform.x)
            minY = Math.min(minY, childBound.minY * transform.scaleY + transform.y)
            maxX = Math.max(maxX, childBound.maxX * transform.scaleX + transform.x)
            maxY = Math.max(maxY, childBound.maxY * transform.scaleY + transform.y)
            
        }
        // console.log(`calclulate ${gameObject.id}`)
        // console.log({minX, minY, maxX, maxY})
        transform.anchorBound = {minX, minY, maxX, maxY}
        transform.width = maxX - minX
        transform.height = maxY - minY
        transform.anchor = this.setAnchor(transform)

        return {minX, minY, maxX, maxY}
    }

    calculateBitmapBound(gameObject: GameObject):{minX: number, minY: number, maxX: number, maxY: number}{
        var minX = 0
        var minY = 0
        var maxX = 0
        var maxY = 0
        var width = 0
        var height = 0
    
        const transform = gameObject.getBehaviour(Transform)
        const renderer = gameObject.getBehaviour(BitmapRenderer)
        
        // createPrefab时，renderer.image为null
        if(!renderer.image){
            if(!renderer.source){
                throw new Error(`${gameObject.id}'s BitmapRenderer source is null`)
            }
            renderer.image = this.gameEngine.resourceManager.getImage(renderer.source)
        
            renderer.scaleX = renderer.scaleXForUI;
            renderer.scaleY = renderer.scaleYForUI;
            renderer.borderWidth = renderer.borderWidthForUI;
        
            renderer.setAnchor(renderer.anchorType);
        }
    
        // 判断渲染类型
        if(renderer.renderType === 'ui'){
            width = renderer.uiGridWidth * transform.scaleX 
            height = renderer.uiGridHeight * transform.scaleY
        }
        else{
            width = renderer.image.width * transform.scaleX
            height = renderer.image.height * transform.scaleY
        }
        // 判断BitmapRenderer锚点类型
        switch (renderer.anchorType) {
            case 'left-top':
                minX = transform.x
                minY = transform.y
                maxX = transform.x + width 
                maxY = transform.y + height
                break;
            case 'center-top':
                minX = transform.x - width / 2
                minY = transform.y
                maxX = transform.x + width / 2
                maxY = transform.y + height
                break;
            case 'right-top':
                minX = transform.x - width
                minY = transform.y
                maxX = transform.x
                maxY = transform.y + height
                break;
            case 'left-center':
                minX = transform.x
                minY = transform.y - height / 2
                maxX = transform.x + width
                maxY = transform.y + height / 2
                break;
            case 'center':
                minX = transform.x - width / 2
                minY = transform.y - height / 2
                maxX = transform.x + width / 2
                maxY = transform.y + height / 2
                break;
            case 'right-center':
                minX = transform.x - width
                minY = transform.y - height / 2
                maxX = transform.x
                maxY = transform.y + height / 2
                break;
            case 'left-bottom':
                minX = transform.x
                minY = transform.y - height
                maxX = transform.x + width
                maxY = transform.y
                break;
            case 'center-bottom':
                minX = transform.x - width / 2
                minY = transform.y - height
                maxX = transform.x + width / 2
                maxY = transform.y
                break;
            case 'right-bottom':
                minX = transform.x - width
                minY = transform.y - height
                maxX = transform.x
                maxY = transform.y
                break;
            default:
                minX = transform.x
                minY = transform.y
                maxX = transform.x + width
                maxY = transform.y + height
                break;
        }
    
        return {minX, minY, maxX, maxY}
    }
    
    calculateTextBound(gameObject: GameObject):{minX: number, minY: number, maxX: number, maxY: number}{
        var minX = 0
        var minY = 0
        var maxX = 0
        var maxY = 0
        var width = 0
        var height = 0
        const transform = gameObject.getBehaviour(Transform)
        const renderer = gameObject.getBehaviour(TextRenderer)
    
        width = renderer.measuredTextWidth * transform.scaleX
        height = renderer.fontSize * transform.scaleY
        
        // 判断TextRenderer锚点类型
        switch (renderer.anchorType) {
            case 'left-top':
                minX = transform.x
                minY = transform.y
                maxX = transform.x + width
                maxY = transform.y + height
                break;
            case 'center-top':
                minX = transform.x - width / 2
                minY = transform.y
                maxX = transform.x + width / 2
                maxY = transform.y + height
                break;
            case 'right-top':
                minX = transform.x - width
                minY = transform.y
                maxX = transform.x
                maxY = transform.y + height
                break;
            case 'left-center':
                minX = transform.x
                minY = transform.y - height / 2
                maxX = transform.x + width
                maxY = transform.y + height / 2
                break;
            case 'center':
                minX = transform.x - width / 2
                minY = transform.y - height / 2
                maxX = transform.x + width / 2
                maxY = transform.y + height / 2
                break;
            case 'right-center':
                minX = transform.x - width
                minY = transform.y - height / 2
                maxX = transform.x
                maxY = transform.y + height / 2
                break;
            case 'left-bottom':
                minX = transform.x
                minY = transform.y - height
                maxX = transform.x + width
                maxY = transform.y
                break;
            case 'center-bottom':
                minX = transform.x - width / 2
                minY = transform.y - height
                maxX = transform.x + width / 2
                maxY = transform.y
                break;
            case 'right-bottom':
                minX = transform.x - width
                minY = transform.y - height
                maxX = transform.x
                maxY = transform.y
                break;
            default:
                minX = transform.x
                minY = transform.y
                maxX = transform.x + width
                maxY = transform.y + height
                break;
    
        }
    
        // console.log(gameObject.id, minX, minY, maxX, maxY)
        return {minX, minY, maxX, maxY}
    }
    
    setAnchor(transform: Transform):{x: number, y: number}{
        switch (transform.anchorType) {
            case 'left-top':
                return {x: 0, y: 0}
            case 'center-top':
                return {x: -transform.width / 2, y: 0}
            case 'right-top':
                return {x: -transform.width, y: 0}
            case 'left-center':
                return {x: 0, y: -transform.height / 2}
            case 'center':
                return {x: -transform.width / 2, y: -transform.height / 2}
            case 'right-center':
                return {x: -transform.width, y: -transform.height / 2}
            case 'left-bottom':
                return {x: 0, y: -transform.height}
            case 'center-bottom':
                return {x: -transform.width / 2, y: -transform.height}
            case 'right-bottom':
                return {x: -transform.width, y: -transform.height}
            default:
                return {x: 0, y: 0}
        }
    }

}


