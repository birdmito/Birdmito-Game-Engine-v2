import { Renderer } from "../engine";
import { Behaviour } from "./Behaviour";
import { Transform } from "./Transform";
import { Rectangle, Hexagon, Circle } from "./math";
import { number } from "./validators/number";
import { string } from "./validators/string";

export class HexagonBorderRenderer extends Behaviour implements Renderer{
    @string()
    color = "white";

    hitAreaType: "hexagon";
    width: number = 172;
    height: number = 200;
    circumradius : number =100;

    setAnchor(anchorType: any): void {
        throw new Error("Method not implemented.");
    }
    getBounds(): Hexagon{
        // throw new Error("Method not implemented.");
        switch(this.hitAreaType) {
            case 'hexagon':
                return{
                    x: this.width / 2,   //因为六边形默认以真实锚点为中心生成，所以需要将中心点映射到图片中心
                    y: this.height / 2,  //因为六边形默认以真实锚点为中心生成，所以需要将中心点映射到图片中心
                    circumradius: this.circumradius
                }
            default:
                this.hitAreaType = 'hexagon';
                return{
                    x: this.width / 2,   //因为六边形默认以真实锚点为中心生成，所以需要将中心点映射到图片中心
                    y: this.height / 2,  //因为六边形默认以真实锚点为中心生成，所以需要将中心点映射到图片中心
                    circumradius: this.circumradius
                }  
        }
    }
    
}