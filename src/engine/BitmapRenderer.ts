import { Renderer } from "../engine";
import { Behaviour } from "./Behaviour";
import { Rectangle } from "./math";
import { string } from "./validators/string";

export class BitmapRenderer extends Behaviour implements Renderer {
    @string()
    source = "";
    image: HTMLImageElement;
    anchor: { x: number, y: number } = { x: 0, y: 0 };

    // 锚点类型：左上角，中上，右上角，左中，中心，右中，左下角，中下，右下角
    @string()
    anchorType: 'left-top' | 'center-top' | 'right-top' | 'left-center' | 'center' | 'right-center' | 'left-bottom' | 'center-bottom' | 'right-bottom' = 'left-top';

    onStart(): void {
        if(this.source) {
            this.image = this.engine.resourceManager.getImage(this.source);
        }
        this.setAnchor(this.anchorType);

    }

    getBounds(): Rectangle {
        const img = this.engine.resourceManager.getImage(this.source)
        return {
            x: this.anchor.x,
            y: this.anchor.y,
            width: this.image.width,
            height: this.image.height,
        };
    }

    setAnchor(anchorType) {
        switch(anchorType) {
            case 'left-top':
                this.anchor = { x: 0, y: 0 };
                break;
            case 'center-top':
                this.anchor = { x: -this.image.width / 2, y: 0 };
                break;
            case 'right-top':
                this.anchor = { x: -this.image.width, y: 0 };
                break;
            case 'left-center':
                this.anchor = { x: 0, y: -this.image.height / 2 };
                break;
            case 'center':
                this.anchor = { x: -this.image.width / 2, y: -this.image.height / 2 };
                break;
            case 'right-center':
                this.anchor = { x: -this.image.width, y: -this.image.height / 2 };
                break;
            case 'left-bottom':
                this.anchor = { x: 0, y: -this.image.height };
                break;
            case 'center-bottom':
                this.anchor = { x: -this.image.width / 2, y: -this.image.height };
                break;
            case 'right-bottom':
                this.anchor = { x: -this.image.width, y: -this.image.height };
                break;
            default:
                this.anchor = { x: 0, y: 0 };
                // alert('anchorType error');
                break;
        }
    }
}
