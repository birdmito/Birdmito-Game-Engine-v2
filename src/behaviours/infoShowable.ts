import { Behaviour } from "../engine/Behaviour";
import { Province } from "./Province";
import { Resource } from "./Resource";

export interface infoShowable {
    //对目标ui的信息进行展示
    getInfo(): string;
}