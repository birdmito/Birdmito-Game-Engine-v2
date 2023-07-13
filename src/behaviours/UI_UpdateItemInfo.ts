import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { TextRenderer } from "../engine/TextRenderer";
import { Building } from "./Building";
import { Province } from "./Province";
import { Technology } from "./Technology";
import { UnitParam } from "./UnitParam";

export class UI_UpdateItemInfo extends Behaviour {
    province: Province;
    itemName: string;
    indexInQueue: number = -1;

    onUpdate(): void {
        if (Technology.getNationTechByName(1, this.itemName)) {
            const tech = Technology.getNationTechByName(1, this.itemName);
            this.gameObject.getChildById("_ItemInfoText").getBehaviour(TextRenderer).text = tech.getInfo();
        }
        else if (Building.getProvinceBuildingByName(this.province, this.itemName)) {
            const building = Building.getProvinceBuildingByName(this.province, this.itemName);
            this.gameObject.getChildById("_ItemInfoText").getBehaviour(TextRenderer).text = building.getInfo();
        }
        else if (UnitParam.getProvinceUnitParamByName(this.province, this.itemName)) {
            const unit = UnitParam.getProvinceUnitParamByName(this.province, this.itemName);
            this.gameObject.getChildById("_ItemInfoText").getBehaviour(TextRenderer).text = unit.getInfo();
        }
        else {
            console.warn("UI_UpdateItemInfo: 未找到建筑或单位")
        }

        if (this.indexInQueue !== -1) {
            this.gameObject.parent.getChildById("_ProductProcessText").getBehaviour(TextRenderer).text =
                `${this.province.productQueue[this.indexInQueue].productProcess} / ${this.province.productQueue[this.indexInQueue].productProcessMax}`;
        }

        //更新图标
        const itemButton = this.gameObject.parent.getChildById("_ItemButton");
        switch (this.itemName) {
            case "金矿":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingMine.png'
                break;
            case "兵营":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingArmy.png'
                break;
            case "大学":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingUniversity.png'
                break;
            case "秘源金矿":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingMagicMine.png'
                break;
            case "机械工业厂":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingIndustry.png'
                break;
            case "贸易站":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingTrade.png'
                break;
            case "秘源精炼厂":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingMagicIndustry.png'
                break;
            case "工厂":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingFactory.png'
                break;
            case '探秘奥坎之径':
            case '我来我见我征服':
            case '科技第一生产力':
            case '劳动资源统合':
            case '政府规模升级':
            case '劳动力再升级':
            case '科技再生产':
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_Technology_1.png'
                break;
            case '战火狂潮之道':
            case '下岗士兵再就业':
            case '配置士兵开拓车':
            case '先进作战机械':
            case '小兵团作战':
            case '彻查士兵档案':
            case '配置飞行装置':
            case '配置秘源护盾':
            case '先进自走火炮':
            case '现今机械装配':
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_Technology_2.png'
                break;
            case '奇迹工坊之路':
            case '秘源驱动机械':
            case '发掘秘源之金':
            case '全民机械浪潮':
            case '新型机械工业':
            case '浪淘尽现黄金':
            case '秘源金销全国':
            case '秘源金再升级':
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_Technology_3.png'
                break;
            case '开拓者':
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_Unit_Explore.png'
                break;
            case '筑城者':
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_Unit_BuildCity.png'
                break;
            case '士兵':
            case '自行火炮':
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_Unit_Soldier.png'
                break;

        }
    }
}


// new Technology("探秘奥坎之径", [], 100, "殖民所需的金钱-10%", [-0.1]),
// new Technology("我来我见我征服", ["探秘奥坎之径"], 200, "城市控制上限基础值+3", [3]),
// new Technology("科技第一生产力", ["探秘奥坎之径"], 200, "解锁科技所需的科技点-10%", [-0.1]),
// new Technology("劳动资源统合", ["我来我见我征服"], 300, "城市控制上限翻倍"),
// new Technology("政府规模升级", ["我来我见我征服"], 300, "升级政府等级所需的金钱-10%", [-0.1]),
// new Technology("劳动力再升级", ["我来我见我征服"], 300, "开拓者的生产所需的生产力-20%", [-0.2]),
// new Technology("科技再生产", ["科技第一生产力"], 200, "此后，每研究一项科技，当前拥有的地块基础产出+1", [0]),
// new Technology("战火狂潮之道", [], 100, "单位招募金钱花费-10%", [-0.1]),
// new Technology("下岗士兵再就业", ["战火狂潮之道"], 200, "招募单位所需的生产力-10%", [-0.1]),
// new Technology("配置士兵开拓车", ["战火狂潮之道"], 200, "所有士兵行动力上限+3", [3]),
// new Technology("先进作战机械", ["战火狂潮之道"], 200, "士兵战斗力提高+10%", [0.1]),
// new Technology("小兵团作战", ["下岗士兵再就业"], 300),
// new Technology("彻查士兵档案", ["下岗士兵再就业"], 300, "单位维护费-20%", [-0.2]),
// new Technology("配置飞行装置", ["配置士兵开拓车"], 300),
// new Technology("配置秘源护盾", ["配置士兵开拓车"], 300, "战斗中所受伤害-10%", [-0.1]),
// new Technology("先进自走火炮", ["先进作战机械"], 300, "解锁新兵种【自走火炮】：当该单位处于战斗状态时，使该场战斗你的所有骰子+1", [1]),
// new Technology("先进机械装配", ["先进作战机械"], 300, "士兵行动AP+1，触发战斗时，战斗骰子+1", [1, 1]),
// new Technology("奇迹工坊之路", [], 100, "建筑花费-10%", [-0.1]),
// new Technology("秘源驱动机械", ["奇迹工坊之路"], 200, "所有省份生产力+10%", [0.1]),
// new Technology("发掘秘源之金", ["奇迹工坊之路"], 200, " 解锁新建筑【秘源金矿】：地块金币产出增加+40%（每个省份仅能建立一个）", [0.4]),
// new Technology("全民机械浪潮", ["秘源驱动机械"], 300, "城市中的建筑现在将额外提供2点生产力", [2]),
// new Technology("新型机械工业", ["秘源驱动机械", "发掘秘源之金"], 300, "解锁新建筑【机械工业厂】：该建筑产出15点生产力（每个省份仅能建立一个）"),
// new Technology("浪淘尽现黄金", ["发掘秘源之金"], 300, "当前控制的所有地块金币产出+1", [1]),
// new Technology("秘源金销全国", ["发掘秘源之金"], 300, "解锁新建筑【贸易站】：当相邻的地块同时拥有【贸易站】时，该省份金币产出+5", [5]),
// new Technology("秘源金再升级", ["发掘秘源之金"], 300, "解锁新建筑【秘源精炼厂】：仅可在有“秘源金矿”的地块建造，在提供金币产出+2的同时，生产力+2", [1]),
