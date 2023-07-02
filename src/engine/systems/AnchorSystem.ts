import { GameObject } from "../../engine";
import { Transform } from "../Transform";
import { pointAppendMatrix } from "../math";
import { System } from "./System";

export class AnchorSystem extends System{
    onStart(): void {
        console.log('AnchorSystem start')
        const bound = this.calculateContainerBound(this.rootGameObject)
        console.log(bound)
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

        for(const child of gameObject.children){
            const childBound = this.calculateContainerBound(child)

            minX = Math.min(minX, childBound.minX * transform.scaleX + transform.x)
            minY = Math.min(minY, childBound.minY * transform.scaleY + transform.y)
            maxX = Math.max(maxX, childBound.maxX * transform.scaleX + transform.x)
            maxY = Math.max(maxY, childBound.maxY * transform.scaleY + transform.y)
            
        }

        return {minX, minY, maxX, maxY}
    }
}