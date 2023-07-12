import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { UI_selectedProvinceInfoPrefabBinding } from "../bindings/UI_selectedProvinceInfoPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { Province } from "./Province";
import { UnitBehaviour, } from "./UnitBehaviour";
import { UI_UnitActButton } from "./UI_UnitActButton";
import { build } from "vite";
import { UI_itemPrefabBinding } from "../bindings/UI_itemPrefabBinding";
import { UI_BuildButton } from "./UI_BuildButton";
import { Building } from "./Building";
import { Nation } from "./Nation";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { GameProcess } from "./GameProcess";
import { UI_UpdateItemInfo } from "./UI_UpdateItemInfo";
import { BitmapRenderer } from "../engine/BitmapRenderer";

export class UI_UpdateSelectedObjInfo extends Behaviour {
    // lastUpdateTime;
    onStart(): void {
        // this.lastUpdateTime = Date.now();

        if (this.selectedBehaviour === null) {
            return;
        }
        else if (this.selectedBehaviour instanceof Province) {
            const province = this.selectedBehaviour as Province;
            //根据地形百分比设置省份图片
            if (province.plainPercent > 0.5) {
                getGameObjectById("ProvinceInfoLayer2").getBehaviour(BitmapRenderer).source =
                    "./assets/images/ScreenArt_ProvincePlain_2.png";
            }
            else if (province.forestPercent > 0.5) {
                getGameObjectById("ProvinceInfoLayer2").getBehaviour(BitmapRenderer).source =
                    "./assets/images/ScreenArt_ProvinceForest_0.png";
            }
            else if (province.mountainPercent > 0.5) {
                getGameObjectById("ProvinceInfoLayer2").getBehaviour(BitmapRenderer).source =
                    "./assets/images/ScreenArt_ProvinceMountain_0.png";
            }
            else if (province.lakePercent > 0.5) {
                getGameObjectById("ProvinceInfoLayer2").getBehaviour(BitmapRenderer).source =
                    "./assets/images/ScreenArt_ProvinceLake_0.png";
            }
            else {
                //海洋
                getGameObjectById("ProvinceInfoLayer2").getBehaviour(BitmapRenderer).source =
                    "./assets/images/ScreenArt_ProvinceOcean_0.png";
            }

            //更新Info界面
            this.updateSelectedProvinceBuildingListUI();
            this.updateSelectedProvinceProductQueueUI();

            //若当前选中项不在玩家国家的city中，则删除建造按钮
            if (!Nation.nations[GameProcess.playerNationId].cityList.some(city => city === province)) {
                getGameObjectById("BuildButton").destroy();
            }

            //若当前选中项不在玩家国家的city中，或者当前选中项没有兵营，则删除征兵按钮
            if (!Nation.nations[GameProcess.playerNationId].cityList.some(city => city === province) || !province.buildingList.some(building => building.name === "兵营")) {
                getGameObjectById("RecruitButton").destroy();
            }

            //若当前选中省份不属于任何国家，则删除政府按钮
            if (province.nationId === 0) {
                getGameObjectById("GovernmentButton").destroy();
            }

        }
        else if (this.selectedBehaviour instanceof UnitBehaviour) {
            const unit = this.selectedBehaviour as UnitBehaviour;
            //若不是玩家的单位，则销毁UI_UnitBehaviourButton
            if (unit.nationId !== GameProcess.playerNationId) {
                getGameObjectById("UI_UnitBehaviourButton").destroy();
            }
        }
    }

    onUpdate(): void {
        // if (Date.now() - this.lastUpdateTime < 1000) {
        //     return;  // 1秒更新一次
        // }

        // this.lastUpdateTime = Date.now();
        if (this.selectedBehaviour === null) {
            return;
        }
        else if (this.selectedBehaviour instanceof Province) {
            //更新Info界面
            const province = this.selectedBehaviour as Province;
            if (province.isCity) {
                getGameObjectById("ProvinceTypeText").getBehaviour(TextRenderer).text = `城市`;
            }
            else {
                getGameObjectById("ProvinceTypeText").getBehaviour(TextRenderer).text = `村庄`;
            }
            getGameObjectById("ProvinceNationNameText").getBehaviour(TextRenderer).text = `所属国家：${province.nationId}`;
            getGameObjectById("ProvinceProductionText").getBehaviour(TextRenderer).text = `奥坎盾：${province.provinceProduction.dora.toString()} 
            ||生产力：${province.provinceProduction.production.toString()} ||科技点：${province.provinceProduction.techPoint.toString()}`;
            getGameObjectById("ProvinceApCostText").getBehaviour(TextRenderer).text = `行动力消耗：${province.apCost}`;
            getGameObjectById("ProvincePlainPercentText").getBehaviour(TextRenderer).text = `平原：${Math.floor(province.plainPercent * 100)}%`;
            getGameObjectById("ProvinceLakePercentText").getBehaviour(TextRenderer).text = `湖泊：${Math.floor(province.lakePercent * 100)}%`;
            getGameObjectById("ProvinceForestPercentText").getBehaviour(TextRenderer).text = `森林：${Math.floor(province.forestPercent * 100)}%`;
            getGameObjectById("ProvinceMountainPercentText").getBehaviour(TextRenderer).text = `山地：${Math.floor(province.mountainPercent * 100)}%`;
            // this.updateSelectedProvinceBuildingListUI();
            // this.updateSelectedProvinceProductQueueUI();
        }
        else if (this.selectedBehaviour instanceof UnitBehaviour) {
            const unit = this.selectedBehaviour as UnitBehaviour;
            getGameObjectById("UnitNameText").getBehaviour(TextRenderer).text = `单位名称：${unit.unitParam.name}`;
            getGameObjectById("UnitNationText").getBehaviour(TextRenderer).text = `所属国家：${unit.nationId}`;
            getGameObjectById("UnitApText").getBehaviour(TextRenderer).text = `行动点：${unit.unitParam.ap}/${unit.unitParam.apMax}`;
            getGameObjectById("UnitQuantityText").getBehaviour(TextRenderer).text = `数量：${unit.unitParam.quantity}`;
            getGameObjectById("UnitPowerText").getBehaviour(TextRenderer).text = `战力：${unit.power}`;
        }
    }

    onEnd(): void {
        SelectedObjectInfoMangaer.selectedBehaviour = null;  //清空选中项
        SelectedObjectInfoMangaer.selectedInfoWindow = null;  //清空选中项
    }

    selectedBehaviour: Behaviour;
    updateSelectedProvinceBuildingListUI() {
        console.log("updateSelectedProvinceBuildingListUI");
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
                if (province.nationId === 1 || GameProcess.isCheat) {
                    UI_buildingBinding.itemClickEventText = "拆除";
                }
                else {
                    UI_buildingBinding.itemClickEventText = " ";
                }
                const UI_building = this.engine.createPrefab(UI_buildingBinding);
                UI_building.getChildById("_ItemInfo").getBehaviour(UI_UpdateItemInfo).province = province;
                provinceBuildingList.addChild(UI_building);
            }
        }
    }

    updateSelectedProvinceProductQueueUI() {
        console.log("updateSelectedProvinceProductQueueUI");
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
                const UI_itemBinding = new UI_itemPrefabBinding;
                UI_itemBinding.item = productedItem.productName;
                UI_itemBinding.idInList = i;
                if (province.nationId === GameProcess.playerNationId || GameProcess.isCheat) {
                    UI_itemBinding.itemClickEventText = "取消";
                }
                else {
                    UI_itemBinding.itemClickEventText = " ";
                }
                const itemPrefab = this.engine.createPrefab(UI_itemBinding)
                itemPrefab.getChildById("_ItemInfo").getBehaviour(UI_UpdateItemInfo).province = province;
                itemPrefab.getChildById("_ItemInfo").getBehaviour(UI_UpdateItemInfo).indexInQueue = i;
                productQueueRoot.addChild(itemPrefab);
            }
        }
    }
}
