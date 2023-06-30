import { UI_SelectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { UI_ColonyButton } from "./UI_ColonyButton";
import { MapManager } from "./MapManager";

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
            const InfoUI = this.gameObject.engine.createPrefab(new UI_SelectedUnitInfoPrefabBinding);
            getGameObjectById("uiRoot").addChild(InfoUI);
            const ColonyButton = getGameObjectById("UI_ColonyButton");
            ColonyButton.getBehaviour(UI_ColonyButton).provinceToColony =
                getGameObjectById("Map").getBehaviour(MapManager).provinces[this.provinceCoor.x][this.provinceCoor.y];
            ColonyButton.getBehaviour(UI_ColonyButton).unitToDestroy = this.gameObject;
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