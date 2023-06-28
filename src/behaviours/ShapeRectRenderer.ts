import { Renderer } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Rectangle } from "../engine/math";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";

export class ShapeRectRenderer extends Behaviour implements Renderer {
    @number()
    width = 100;
    @number()
    height = 100;
    @string({
        editorType: 'select', options: [
            { value: 'red', label: "红色" },
            { value: 'blue', label: '蓝色' }
        ]
    })
    color = "red";

    getBounds(): Rectangle {
        return {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
        };
    }
}
