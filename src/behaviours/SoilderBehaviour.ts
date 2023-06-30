import { colonyPrefabButtonBinding } from "../bindings/ColonyButtonPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ColonyBehaviour } from "./ColonyBehaviour";
import { MapManagerBehaviour } from "./MapManagerBehaviour";

export class SoilderBehaviour extends Behaviour {
    nationId: number = 1;
    provinceCoor: { x: number, y: number } = { x: 0, y: 0 };

    onStart(): void {
        this.updateTransform();
    }

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log('soilder is cliceked')
            const cbutton = this.gameObject.engine.createPrefab(new colonyPrefabButtonBinding);
            cbutton.getBehaviour(ColonyBehaviour).provinceToColony =
                getGameObjectById("Map").getBehaviour(MapManagerBehaviour).provinces[this.provinceCoor.x][this.provinceCoor.y];
            getGameObjectById("uiRoot").addChild(cbutton);
            cbutton.getBehaviour(ColonyBehaviour).unitToDestroy = this.gameObject;
        }
    }

    updateTransform(): void {
        const gridSpace = getGameObjectById("Map").getBehaviour(MapManagerBehaviour).gridSpace;
        const x = this.provinceCoor.x * gridSpace + gridSpace / 2;
        const y = this.provinceCoor.y * gridSpace * (Math.sqrt(3) / 2) + gridSpace * (Math.sqrt(3) / 2) / 2;
        this.gameObject.getBehaviour(Transform).x = x;
        this.gameObject.getBehaviour(Transform).y = y;
    }
}