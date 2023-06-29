import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ProvincePrefabBinding } from "../bindings/ProvincePrefabBinding";

export class InitialMapBehaviour extends Behaviour {
    onStart(): void {
        this.gameObject.engine.createPrefab2Children(new ProvincePrefabBinding(), this.gameObject);
    }
}
