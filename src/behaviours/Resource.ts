import { Behaviour } from "../engine/Behaviour";
import { Province } from "./Province";

export class Resource {
    constructor(dora = 5, production = 0, techPoint = 0) {
        this.dora = dora;
        this.production = production;
        this.techPoint = techPoint;
    }
    dora: number = 0;
    //生产力
    production: number = 0;
    techPoint: number = 0;

    //加法运算
    add(resource: Resource): Resource {
        return new Resource(this.dora + resource.dora, this.production + resource.production, this.techPoint + resource.techPoint);
    }

    //向下取整
    floor() {
        this.dora = Math.floor(this.dora);
        this.production = Math.floor(this.production);
        this.techPoint = Math.floor(this.techPoint);
    }
}