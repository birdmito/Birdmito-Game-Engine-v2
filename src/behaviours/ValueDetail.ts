import { Behaviour } from "../engine/Behaviour";
import { Province } from "./Province";
import { Resource } from "./Resource";

export class ValueDetail {
    //增加项列表
    incomeList: NumberWithName[] = [];
    addIncome(value: number, name: string) {
        const item = this.getIncomeListItemByName(name);
        if (item) {
            item.value += value;
        } else {
            this.incomeList.push(new NumberWithName(name, value));
        }
    }
    getIncomeListItemByName(name: string): NumberWithName {
        return this.incomeList.find(reson => reson.name === name);
    }
    
    //减少项列表
    outcomeList: NumberWithName[] = [];
    addOutcome(value: number, name: string) {
        const item = this.getOutcomeListItemByName(name);
        if (item) {
            item.value += value;
        } else {
            this.outcomeList.push(new NumberWithName(name, value));
        }
    }
    getOutcomeListItemByName(name: string): NumberWithName {
        return this.outcomeList.find(reson => reson.name === name);
    }

    //获得两个列表的string总和
    getSumInfo(): string {
        let sumInfo = '';
        this.incomeList.forEach(item => {
            sumInfo +=  item.value + '：+' + item.name + '\n';
        });
        this.outcomeList.forEach(item => {
            sumInfo +=  item.value + '：-' + item.name + '\n';
        });
        return sumInfo;
    }
}

export class NumberWithName {
    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
    name: string;
    value: number;
}