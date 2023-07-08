import { Renderer } from "../engine";
import { Behaviour } from "./Behaviour";
import { Rectangle } from "./math";
import { string } from "./validators/string";

export class BitmapRenderer extends Behaviour implements Renderer {
    @string()
    source = "";
    image: HTMLImageElement;

    // 九宫格
    // ---------------------------
    @string()
    renderType: 'image' | 'ui' = 'image';

    @string()
    scaleXForUI = 1;
    @string()
    scaleYForUI = 1;
    @string()
    borderWidthForUI = 30;

    scaleX = 1;
    scaleY = 1;
    borderWidth = 30;

    // 九宫格自适应后的宽高
    get uiGridWidth() {
        if (this.renderType === 'ui') {
            const img = this.engine.resourceManager.getImage(this.source)
            const originalWidth = img.width;
            const originalHeight = img.height;
            const borderWidth = this.borderWidth;
            const cellSize = Math.floor((Math.min(originalWidth, originalHeight) - (borderWidth * 2)));
            return borderWidth * 2 + cellSize * this.scaleX;
        }
        else {
            return this.image.width * this.scaleX;
        }
    }

    get uiGridHeight() {
        if (this.renderType === 'ui') {
            const img = this.engine.resourceManager.getImage(this.source)
            const originalWidth = img.width;
            const originalHeight = img.height;
            const borderWidth = this.borderWidth;
            const cellSize = Math.floor((Math.min(originalWidth, originalHeight) - (borderWidth * 2)));
            return borderWidth * 2 + cellSize * this.scaleY;
        }
        else {
            return this.image.height * this.scaleY;
        }
    }

    // 锚点
    // ---------------------------
    anchor: { x: number, y: number } = { x: 0, y: 0 };
    // 锚点类型：左上角，中上，右上角，左中，中心，右中，左下角，中下，右下角
    @string()
    anchorType: 'left-top' | 'center-top' | 'right-top' | 'left-center' | 'center' | 'right-center' | 'left-bottom' | 'center-bottom' | 'right-bottom' = 'left-top';

    setAnchor(anchorType) {

        var width = this.image.width;
        var height = this.image.height;

        if(this.renderType === 'ui'){
            width = this.uiGridWidth;
            height = this.uiGridHeight;
        }

        switch (anchorType) {
            case 'left-top':
                this.anchor = { x: 0, y: 0 };
                break;
            case 'center-top':
                this.anchor = { x: -width / 2, y: 0 };
                break;
            case 'right-top':
                this.anchor = { x: -width, y: 0 };
                break;
            case 'left-center':
                this.anchor = { x: 0, y: -height / 2 };
                break;
            case 'center':
                this.anchor = { x: -width / 2, y: -height / 2 };
                break;
            case 'right-center':
                this.anchor = { x: -width, y: -height / 2 };
                break;
            case 'left-bottom':
                this.anchor = { x: 0, y: -height };
                break;
            case 'center-bottom':
                this.anchor = { x: -width / 2, y: -height };
                break;
            case 'right-bottom':
                this.anchor = { x: -width, y: -height };
                break;
            default:
                this.anchorType = 'left-top';
                this.anchor = { x: 0, y: 0 };
                // alert('anchorType error');
                break;
        }
    }

    // 点击区域包围盒
    // ---------------------------
    @string()
    hitAreaType: 'rectangle' | 'hexagon' | 'circle' | 'none' = 'rectangle';
    getBounds() {
        var width = this.image.width;
        var height = this.image.height;

        switch(this.hitAreaType){
            case 'rectangle':
                if(this.renderType === 'ui'){
                    width = this.uiGridWidth;
                    height = this.uiGridHeight;
                }
                return {
                    x: this.anchor.x,
                    y: this.anchor.y,
                    width: width,
                    height: height,
                };
            case 'hexagon':
                const circumradius = height / 2;
                return{
                    x: this.anchor.x + width / 2,   //因为六边形默认以真实锚点为中心生成，所以需要将中心点映射到图片中心
                    y: this.anchor.y + height / 2,  //因为六边形默认以真实锚点为中心生成，所以需要将中心点映射到图片中心
                    circumradius: circumradius
                }
            case 'circle':
                const radius = Math.min(width, height) / 2;
                return{
                    x: this.anchor.x + width / 2,   //因为圆形默认以真实锚点为中心生成，所以需要将中心点映射到图片中心
                    y: this.anchor.y + height / 2,  //因为圆形默认以真实锚点为中心生成，所以需要将中心点映射到图片中心
                    radius: radius
                }
                // throw new Error('暂未实现circle包围盒');
            case 'none':
                return{
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                }
            default:
                this.hitAreaType = 'rectangle';
                if(this.renderType === 'ui'){
                    width = this.uiGridWidth;
                    height = this.uiGridHeight;
                }
                return {
                    x: this.anchor.x,
                    y: this.anchor.y,
                    width: width,
                    height: height,
                };
        }

    }

}
