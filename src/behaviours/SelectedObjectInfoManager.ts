import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { UI_selectedProvinceInfoPrefabBinding } from "../bindings/UI_selectedProvinceInfoPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { MapManager } from "./MapManager";
import { Province } from "./Province";
import { Soilder } from "./Soilder";
import { UI_ColonyButton } from "./UI_ColonyButton";

export class SelectedObjectInfoMangaer extends Behaviour {

    onUpdate(): void {
        if (this.selectedBehaviour === null) {
            return;
        }
        else if (this.selectedBehaviour instanceof Province) {
            //更新Info界面
            const province = this.selectedBehaviour as Province;
            getGameObjectById("ProvinceNationNameText").getBehaviour(TextRenderer).text = '所属国家：' + province.nationId.toString();
            getGameObjectById("ProvinceProductionText").getBehaviour(TextRenderer).text = '产出：' + province.production.toString();
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
            this.engine.createPrefab2Children(new UI_selectedProvinceInfoPrefabBinding, getGameObjectById("uiRoot"));
        }
        else if (selectedBehaviour instanceof Soilder) {
            this.engine.createPrefab2Children(new UI_selectedUnitInfoPrefabBinding, getGameObjectById("uiRoot"));

            const ColonyButton = getGameObjectById("UI_ColonyButton");
            ColonyButton.getBehaviour(UI_ColonyButton).provinceToColony =
                getGameObjectById("Map").getBehaviour(MapManager).provinces[selectedBehaviour.provinceCoor.x][selectedBehaviour.provinceCoor.y];
            ColonyButton.getBehaviour(UI_ColonyButton).unitToDestroy = selectedBehaviour.gameObject;
        }
    }
}
