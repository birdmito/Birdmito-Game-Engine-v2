import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { UI_selectedProvinceInfoPrefabBinding } from "../bindings/UI_selectedProvinceInfoPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { ProvinceManager } from "./ProvinceManager";
import { Province } from "./Province";
import { Soilder } from "./Soilder";
import { UI_ColonyButton } from "./UI_ColonyButton";
import { build } from "vite";
import { UI_buildingPrefabBinding } from "../bindings/UI_buildingPrefabBinding";
import { UI_BuildButton } from "./UI_BuildButton";

export class SelectedObjectInfoMangaer extends Behaviour {
    onUpdate(): void {
        if (this.selectedBehaviour === null) {
            return;
        }
        else if (this.selectedBehaviour instanceof Province) {
            //更新Info界面
            const province = this.selectedBehaviour as Province;
            getGameObjectById("ProvinceNationNameText").getBehaviour(TextRenderer).text = '所属国家：' + province.nationId.toString();
            getGameObjectById("ProvinceProductionText").getBehaviour(TextRenderer).text = '产出：' + Math.floor(province.production).toString();
            getGameObjectById("ProvinceApCostText").getBehaviour(TextRenderer).text = '行动点消耗：' + province.apCost.toString();
            getGameObjectById("ProvincePlainPercentText").getBehaviour(TextRenderer).text = '平原：' + Math.floor(province.plainPercent * 100).toString() + '%';
            getGameObjectById("ProvinceLakePercentText").getBehaviour(TextRenderer).text = '湖泊：' + Math.floor(province.lakePercent * 100).toString() + '%';
            getGameObjectById("ProvinceForestPercentText").getBehaviour(TextRenderer).text = '森林：' + Math.floor(province.forestPercent * 100).toString() + '%';
            getGameObjectById("ProvinceMountainPercentText").getBehaviour(TextRenderer).text = '山地：' + Math.floor(province.mountainPercent * 100).toString() + '%';


        }
        else if (this.selectedBehaviour instanceof Soilder) {
            const soilder = this.selectedBehaviour as Soilder;
            getGameObjectById("UnitNationText").getBehaviour(TextRenderer).text = '所属国家：' + soilder.nationId.toString();
            getGameObjectById("UnitApText").getBehaviour(TextRenderer).text = '行动点：' + soilder.ap.toString() + '/' + soilder.apMax.toString();
        }
    }

    selectedBehaviour: Behaviour;
    showSelectedObjectInfo(selectedBehaviour: Behaviour): void {
        //删除旧Info界面
        if (getGameObjectById("UI_selectedProvinceInfo")) {
            getGameObjectById("UI_selectedProvinceInfo").destroy();
        }
        if (getGameObjectById("UI_selectedUnitInfo")) {
            getGameObjectById("UI_selectedUnitInfo").destroy();
        }

        //设置当前选中项
        this.selectedBehaviour = selectedBehaviour;
        //新建新Info界面
        if (selectedBehaviour instanceof Province) {
            const province = selectedBehaviour as Province;
            this.engine.createPrefab2Children(new UI_selectedProvinceInfoPrefabBinding, getGameObjectById("uiRoot"));
            if (province.nationId !== 1) {
                getGameObjectById("BuildButton").destroy();
            }

            this.updateSelectedProvinceBuildingList();
        }
        else if (selectedBehaviour instanceof Soilder) {
            this.engine.createPrefab2Children(new UI_selectedUnitInfoPrefabBinding, getGameObjectById("uiRoot"));

            const ColonyButton = getGameObjectById("UI_ColonyButton");
            ColonyButton.getBehaviour(UI_ColonyButton).provinceToColony =
                ProvinceManager.provinces[selectedBehaviour.soidlerCoor.x][selectedBehaviour.soidlerCoor.y];
            ColonyButton.getBehaviour(UI_ColonyButton).unitToDestroy = selectedBehaviour.gameObject;
        }
    }

    updateSelectedProvinceBuildingList() {
        if (!(this.selectedBehaviour instanceof Province)) {
            //发出警告
            console.warn("当前选中项不是省份，但调用了updateSelectedProvinceBuildingList方法");
            return;
        }
        const province = this.selectedBehaviour as Province;
        const provinceBuildingList = getGameObjectById("ProvinceBuildingListRoot");
        //删除旧建筑列表
        if (provinceBuildingList.children.length > 0) {
            for (let i = 0; i < provinceBuildingList.children.length; i++) {
                provinceBuildingList.children[0].destroy();
            }
        }
        //创建新建筑列表
        if (province.buildingList.length > 0) {
            for (let i = 0; i < province.buildingList.length; i++) {
                const buildingBinding = new UI_buildingPrefabBinding;
                buildingBinding.buildingName = province.buildingList[i].name;
                buildingBinding.buildingInfo = "建筑名称：" + province.buildingList[i].name + " 产出：" + province.buildingList[i].production.toString() + " 状态" + province.buildingList[i].status.toString();
                if (province.nationId === 1) {
                    buildingBinding.buildingEventText = "拆除";
                }
                else {
                    buildingBinding.buildingEventText = "";
                }
                const building = this.engine.createPrefab(buildingBinding);
                building.getBehaviour(Transform).y = 30 + i * 100
                provinceBuildingList.addChild(building);
            }
        }
    }
}
