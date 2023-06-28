import { Matrix } from "../engine";
import { Behaviour } from "./Behaviour";
import { number } from "./validators/number";




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

}