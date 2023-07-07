import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { UI_selectedProvinceInfoPrefabBinding } from "../bindings/UI_selectedProvinceInfoPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { Province } from "./Province";
import { UnitBehaviour, } from "./UnitBehaviour";
import { UI_UnitBehaviourButton } from "./UI_UnitBehaviourButton";
import { build } from "vite";
import { UI_itemPrefabBinding } from "../bindings/UI_itemPrefabBinding";
import { UI_BuildButton } from "./UI_BuildButton";
import { Building } from "./Building";
import { Nation } from "./Nation";

export class UI_UpdateSelectedObjInfo extends Behaviour {
    onUpdate(): void {
        if (this.selectedBehaviour === null) {
            return;
        }
        else if (this.selectedBehaviour instanceof Province) {
            //更新Info界面
            const province = this.selectedBehaviour as Province;
            getGameObjectById("ProvinceNationNameText").getBehaviour(TextRenderer).text = '所属国家：' + province.nationId.toString();
            getGameObjectById("ProvinceProductionText").getBehaviour(TextRenderer).text = '多拉：' + province.provinceProduction.dora.toString() +
                '生产力：' + province.provinceProduction.production.toString() + '科技：' + province.provinceProduction.techPoint.toString();
            getGameObjectById("ProvinceApCostText").getBehaviour(TextRenderer).text = '行动点消耗：' + province.apCost.toString();
            getGameObjectById("ProvincePlainPercentText").getBehaviour(TextRenderer).text = '平原：' + Math.floor(province.plainPercent * 100).toString() + '%';
            getGameObjectById("ProvinceLakePercentText").getBehaviour(TextRenderer).text = '湖泊：' + Math.floor(province.lakePercent * 100).toString() + '%';
            getGameObjectById("ProvinceForestPercentText").getBehaviour(TextRenderer).text = '森林：' + Math.floor(province.forestPercent * 100).toString() + '%';
            getGameObjectById("ProvinceMountainPercentText").getBehaviour(TextRenderer).text = '山地：' + Math.floor(province.mountainPercent * 100).toString() + '%';
            this.updateSelectedProvinceBuildingListUI();
            this.updateSelectedProvinceProductQueueUI();

        }
        else if (this.selectedBehaviour instanceof UnitBehaviour) {
            const soilder = this.selectedBehaviour as UnitBehaviour;
            getGameObjectById("UnitNationText").getBehaviour(TextRenderer).text = '所属国家：' + soilder.nationId.toString();
            getGameObjectById("UnitApText").getBehaviour(TextRenderer).text = '行动点：' + soilder.unitParam.ap.toString() + '/' + soilder.unitParam.apMax.toString();
            //若不是玩家的单位，则销毁UI_UnitBehaviourButton
            if (soilder.nationId !== 1) {
                getGameObjectById("UI_UnitBehaviourButton").destroy();
            }
        }
    }

    selectedBehaviour: Behaviour;
    updateSelectedProvinceBuildingListUI() {
        if (!(this.selectedBehaviour instanceof Province)) {
            //发出警告
            console.warn("当前选中项不是省份，但调用了updateSelectedProvinceBuildingList方法");
            return;
        }
        const province = this.selectedBehaviour as Province;
        const provinceBuildingList = getGameObjectById("ProvinceBuildingListRoot");
        //删除旧建筑列表
        if (provinceBuildingList.children.length > 0) {
            for (let i = provinceBuildingList.children.length - 1; i >= 0; i--) {
                provinceBuildingList.children[i].destroy();
            }
        }
        //创建新建筑列表
        if (province.buildingList.length > 0) {
            for (let i = 0; i < province.buildingList.length; i++) {
                const building = province.buildingList[i];
                const UI_buildingBinding = new UI_itemPrefabBinding;
                UI_buildingBinding.item = building.name;
                UI_buildingBinding.itemInfo = building.getInfo();
                if (province.nationId === 1) {
                    UI_buildingBinding.itemClickEventText = "拆除";
                }
                else {
                    UI_buildingBinding.itemClickEventText = "";
                }
                const UI_building = this.engine.createPrefab(UI_buildingBinding);
                UI_building.getBehaviour(Transform).y = 30 + i * 100
                provinceBuildingList.addChild(UI_building);
            }
        }
    }

    updateSelectedProvinceProductQueueUI() {
        if (!(this.selectedBehaviour instanceof Province)) {
            //发出警告
            console.warn("当前选中项不是省份，但调用了updateSelectedProvinceProductQueue方法");
            return;
        }
        const province = this.selectedBehaviour as Province;
        const productQueueRoot = getGameObjectById("ProductQueueRoot");

        //删除旧生产队列
        if (productQueueRoot.children.length > 0) {
            for (let i = productQueueRoot.children.length - 1; i >= 0; i--) {
                productQueueRoot.children[i].destroy();
            }
        }

        //创建新生产队列
        if (province.productQueue.length > 0) {
            for (let i = 0; i < province.productQueue.length; i++) {
                const productedItem = province.productQueue[i];
                const UI_buildingBinding = new UI_itemPrefabBinding;
                UI_buildingBinding.item = productedItem.productName;
                UI_buildingBinding.itemInfo = productedItem.getInfo();
                UI_buildingBinding.idInList = i;
                UI_buildingBinding.itemClickEventText = "取消";
                productQueueRoot.addChild(this.engine.createPrefab(UI_buildingBinding));
            }
        }

    }
}
