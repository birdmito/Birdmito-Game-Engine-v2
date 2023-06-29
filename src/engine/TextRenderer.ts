import { Renderer } from "../engine";
import { Behaviour } from "./Behaviour";
import { Rectangle } from "./math";
import { string } from "./validators/string";
import { number } from "./validators/number";

export class TextRenderer extends Behaviour implements Renderer {

    @number()
    fontSize = 40;

    @string()
    text = ''

    measuredTextWidth = 0;

    getBounds(): Rectangle {
        return {
            x: 0,
            y: 0,
            width: this.measuredTextWidth,
            height: 40
        };
    }
}