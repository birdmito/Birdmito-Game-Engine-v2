import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { UI_ColonyButton } from "./UI_ColonyButton";
import { MapManager } from "./MapManager";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";

export class Soilder extends Behaviour {
    nationId: number = 1;
    provinceCoor: { x: number, y: number } = { x: 1, y: 0 };

    onStart(): void {
        this.updateTransform();
        console.log("soilder provinceCoor", this.provinceCoor);
    }

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log('soilder is cliceked')
            getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).showSelectedObjectInfo(this);
            // const InfoUI = this.gameObject.engine.createPrefab(new UI_selectedUnitInfoPrefabBinding);
            // getGameObjectById("uiRoot").addChild(InfoUI);
        }
    }

    updateTransform(): void {
        const gridSpace = getGameObjectById("Map").getBehaviour(MapManager).gridSpace;
        const x = this.provinceCoor.x * gridSpace + gridSpace / 2;
        const y = this.provinceCoor.y * gridSpace * (Math.sqrt(3) / 2) + gridSpace * (Math.sqrt(3) / 2) / 2;
        this.gameObject.getBehaviour(Transform).x = x;
        this.gameObject.getBehaviour(Transform).y = y;
    }
}