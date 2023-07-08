import { Province } from "./Province";

export interface Moveable {
    moveToProvince(province: Province): void
}