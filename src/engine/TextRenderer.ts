import { Renderer } from "../engine";
import { Behaviour } from "./Behaviour";
import { Rectangle } from "./math";
import { string } from "./validators/string";
import { number } from "./validators/number";

export class TextRenderer extends Behaviour implements Renderer {

    @number()
    fontSize = 40;

    @string()
    fontFamily = 'Arial';

    @string()
    text = ''

    anchor: { x: number, y: number } = { x: 0, y: 0 };
    // 锚点类型：左上角，中上，右上角，左中，中心，右中，左下角，中下，右下角
    @string()
    anchorType: 'left-top' | 'center-top' | 'right-top' | 'left-center' | 'center' | 'right-center' | 'left-bottom' | 'center-bottom' | 'right-bottom' = 'left-top';

    measuredTextWidth = 0;

    onStart(): void {
        this.setAnchor(this.anchorType);

        if(!this.fontSize){
            alert('fontSize is required');
        }
    }

    getBounds(): Rectangle {
        return {
            x: this.anchor.x,
            y: this.anchor.y - this.fontSize,
            width: this.measuredTextWidth,
            height: this.fontSize,
    }
    }

    setAnchor(anchorType) {
        switch(anchorType) {
            case 'left-top':
                this.anchor = { x: 0, y: this.fontSize };
                break;
            case 'center-top':
                this.anchor = { x: -this.measuredTextWidth / 2, y: this.fontSize };
                break;
            case 'right-top':
                this.anchor = { x: -this.measuredTextWidth, y: this.fontSize };
                break;
            case 'left-center':
                this.anchor = { x: 0, y: this.fontSize / 2 };
                break;
            case 'center':
                this.anchor = { x: -this.measuredTextWidth / 2, y: this.fontSize / 2 };
                break;
            case 'right-center':
                this.anchor = { x: -this.measuredTextWidth, y: this.fontSize / 2 };
                break;
            case 'left-bottom':
                this.anchor = { x: 0, y: 0 };
                break;
            case 'center-bottom':
                this.anchor = { x: -this.measuredTextWidth / 2, y: 0 };
                break;
            case 'right-bottom':
                this.anchor = { x: -this.measuredTextWidth, y: 0 };
                break;
            default:
                this.anchor = { x: 0, y: this.fontSize };
                // alert('anchorType is invalid or not set in your scenes!');
                break;
        }
    }
}