import { Renderer } from "../engine";
import { Behaviour } from "./Behaviour";
import { Rectangle } from "./math";
import { string } from "./validators/string";
import { number } from "./validators/number";

export class TextRenderer extends Behaviour implements Renderer {

    // 字体属性
    // ---------------------------
    @number()
    fontSize = 40;
    @string()
    fontFamily = 'Arial';
    @string()
    text = ''
    @string()
    color = 'black';
    @string()
    lineHeight = '1.2';
    @string()
    lineWidth = '120';

    measuredTextWidth = 0;
    textHeight = 0;

    // 锚点
    // ---------------------------
    anchor: { x: number, y: number } = { x: 0, y: this.textHeight };
    // 锚点类型：左上角，中上，右上角，左中，中心，右中，左下角，中下，右下角
    @string()
    anchorType: 'left-top' | 'center-top' | 'right-top' | 'left-center' | 'center' | 'right-center' | 'left-bottom' | 'center-bottom' | 'right-bottom' = 'left-top';
    
    setAnchor(anchorType) {
        // console.log(this.measuredTextWidth)
        // console.log(this.textHeight/2)
        switch (anchorType) {
            case 'left-top':
                this.anchor = { x: 0, y: 0 };
                break;
            case 'center-top':
                this.anchor = { x: -this.measuredTextWidth / 2, y: 0 };
                break;
            case 'right-top':
                this.anchor = { x: -this.measuredTextWidth, y: 0 };
                break;
            case 'left-center':
                this.anchor = { x: 0, y: -this.textHeight / 2 };
                break;
            case 'center':
                this.anchor = { x: -this.measuredTextWidth / 2, y: -this.textHeight / 2 };
                break;
            case 'right-center':
                this.anchor = { x: -this.measuredTextWidth, y: -this.textHeight / 2 };
                this.anchor = { x: -this.measuredTextWidth, y: -this.textHeight / 2 };
                break;
            case 'left-bottom':
                this.anchor = { x: 0, y: -this.textHeight };
                break;
            case 'center-bottom':
                this.anchor = { x: -this.measuredTextWidth / 2, y: -this.textHeight };
                break;
            case 'right-bottom':
                this.anchor = { x: -this.measuredTextWidth, y: -this.textHeight };
                break;
            default:
                this.anchorType = 'left-top';
                this.anchor = { x: 0, y: 0 };
                // alert('anchorType is invalid or not set in your scenes!');
                break;
        }
    }
    // 点击区域包围盒
    // ---------------------------
    @string()
     hitAreaType: 'rectangle' | 'none' = 'rectangle';
    
    getBounds() {
        switch (this.hitAreaType) {
            case 'rectangle':
                return {
                    x: this.anchor.x,
                    y: this.anchor.y - this.fontSize,
                    width: this.measuredTextWidth,
                    height: this.fontSize,
                }
            case 'none':
                return {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                }
            default:
                this.hitAreaType = 'rectangle';
                return {
                    x: this.anchor.x,
                    y: this.anchor.y - this.fontSize,
                    width: this.measuredTextWidth,
                    height: this.fontSize,
                }
        }
    }

    // 函数逻辑
    // ---------------------------
    onStart(): void {
        if (!this.fontSize) {
            alert('fontSize is required');
        }
    }
}