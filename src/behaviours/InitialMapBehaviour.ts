import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ProvincePrefabBinding } from "../bindings/ProvincePrefabBinding";

export class InitialMapBehaviour extends Behaviour {
    onStart(): void {
        const province = this.gameObject.engine.createPrefab(new ProvincePrefabBinding());
        this.gameObject.addChild(province);
    }
}
