import { Renderer } from "../engine";
import { Behaviour } from "./Behaviour";
import { Transform } from "./Transform";
import { Rectangle, Hexagon, Circle } from "./math";
import { number } from "./validators/number";
import { string } from "./validators/string";

export class HexagonBorderRenderer extends Behaviour implements Renderer{
    @string()
    color = "white";

    hitAreaType: 'none';
    width: number = 172;
    height: number = 200;
    circumradius : number =100;

    setAnchor(anchorType: any): void {
        throw new Error("Method not implemented.");
    }
    getBounds(): Hexagon{
        return {x: 0,y: 0,circumradius: 0};
    }
    
}