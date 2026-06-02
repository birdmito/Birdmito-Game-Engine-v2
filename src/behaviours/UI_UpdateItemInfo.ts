import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { TextRenderer } from "../engine/TextRenderer";
import { Building } from "./Building";
import { Province } from "./Province";
import { Tech, Technology } from "./Technology";
import { UnitParam } from "./UnitParam";

const IconMap: { [key: string]: string } = {
    "金矿": './assets/images/Icon_BuildingMine.png',
    "兵营": './assets/images/Icon_BuildingArmy.png',
    "大学": './assets/images/Icon_BuildingUniversity.png',
    "秘源金矿": './assets/images/Icon_BuildingMagicMine.png',
    "机械工业厂": './assets/images/Icon_BuildingIndustry.png',
    "贸易站": './assets/images/Icon_BuildingTrade.png',
    "秘源精炼厂": './assets/images/Icon_BuildingMagicIndustry.png',
    "工厂": './assets/images/Icon_BuildingFactory.png',
    [Tech.探秘奥坎之径]: './assets/images/Icon_Technology_1.png',
    [Tech.我来我见我征服]: './assets/images/Icon_Technology_1.png',
    [Tech.科技第一生产力]: './assets/images/Icon_Technology_1.png',
    [Tech.劳动资源统合]: './assets/images/Icon_Technology_1.png',
    [Tech.政府规模升级]: './assets/images/Icon_Technology_1.png',
    [Tech.劳动力再升级]: './assets/images/Icon_Technology_1.png',
    [Tech.征服星辰大海]: './assets/images/Icon_Technology_1.png',
    [Tech.战火狂潮之道]: './assets/images/Icon_Technology_2.png',
    [Tech.下岗士兵再就业]: './assets/images/Icon_Technology_2.png',
    [Tech.配置士兵开拓车]: './assets/images/Icon_Technology_2.png',
    [Tech.先进作战机械]: './assets/images/Icon_Technology_2.png',
    [Tech.小兵团作战]: './assets/images/Icon_Technology_2.png',
    [Tech.彻查士兵档案]: './assets/images/Icon_Technology_2.png',
    [Tech.配置飞行装置]: './assets/images/Icon_Technology_2.png',
    [Tech.配置秘源护盾]: './assets/images/Icon_Technology_2.png',
    [Tech.先进自走火炮]: './assets/images/Icon_Technology_2.png',
    [Tech.先进机械装配]: './assets/images/Icon_Technology_2.png',
    [Tech.奇迹工坊之路]: './assets/images/Icon_Technology_3.png',
    [Tech.秘源驱动机械]: './assets/images/Icon_Technology_3.png',
    [Tech.发掘秘源之金]: './assets/images/Icon_Technology_3.png',
    [Tech.全民机械浪潮]: './assets/images/Icon_Technology_3.png',
    [Tech.新型机械工业]: './assets/images/Icon_Technology_3.png',
    [Tech.浪淘尽现黄金]: './assets/images/Icon_Technology_3.png',
    [Tech.秘源金销全国]: './assets/images/Icon_Technology_3.png',
    [Tech.秘源金再升级]: './assets/images/Icon_Technology_3.png',
    '开拓者': './assets/images/Icon_Unit_Explore.png',
    '筑城者': './assets/images/Icon_Unit_BuildCity.png',
    '士兵': './assets/images/Icon_Unit_Soldier.png',
    '自行火炮': './assets/images/Icon_Unit_Soldier.png'
};

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
        const iconPath = IconMap[this.itemName] || './assets/images/Icon_Unit_Soldier.png';
        itemButton.getBehaviour(BitmapRenderer).source = iconPath;
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
