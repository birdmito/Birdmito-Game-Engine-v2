import { Matrix } from "../engine";
import { Behaviour } from "./Behaviour";
import { number } from "./validators/number";
import { string } from "./validators/string";




const component: ClassDecorator = () => {

}

@component
export class Transform extends Behaviour {

    localMatrix = new Matrix();
    globalMatrix = new Matrix();
    @number()
    x = 0;
    @number()
    y = 0;
    @number({ allowZero: false })
    scaleX = 1;
    @number({ allowZero: false })
    scaleY = 1;
    @number()
    rotation = 0;

    // 锚点
    // -----------------------------
    anchor: { x: number, y: number } = { x: 0, y: 0 };
    // 锚点类型：左上角，中上，右上角，左中，中心，右中，左下角，中下，右下角
    @string()
    anchorType: 'left-top' | 'center-top' | 'right-top' | 'left-center' | 'center' | 'right-center' | 'left-bottom' | 'center-bottom' | 'right-bottom' = 'left-top';
    @string()
    boundWidth = '1920';
    @string()
    boundHeight = '1080';
}