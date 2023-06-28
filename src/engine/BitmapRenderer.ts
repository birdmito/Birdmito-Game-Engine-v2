import { Renderer } from "../engine";
import { Behaviour } from "./Behaviour";
import { Rectangle } from "./math";
import { string } from "./validators/string";

export class BitmapRenderer extends Behaviour implements Renderer {
    @string()
    source = "";

    getBounds(): Rectangle {
        const img = this.engine.resourceManager.getImage(this.source)
        return {
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
        };
    }
}
