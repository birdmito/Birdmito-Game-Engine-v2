import { Behaviour } from "../engine/Behaviour";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { infoShowable } from "./infoShowable";

export class ProductingItem implements infoShowable {
    constructor(productName: string, productProcessMax: number, productType: 'unit' | 'building') {
        this.productName = productName;
        this.productProcessMax = productProcessMax;
        this.productType = productType;
    }
    //生产物品的类别
    productType: 'unit' | 'building';
    //生产物品的名称
    productName: string;
    //生产进度
    productProcess: number = 0;
    //所需生产力
    productProcessMax: number;

    getInfo(){
        return `${this.productName}(${this.productProcess}/${this.productProcessMax})`;
    }
}