import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";

export class Rotatable extends Behaviour {
    onTick(duringTime: number) {
        const trasnfrom = this.gameObject.getBehaviour(Transform);
        trasnfrom.rotation += 1;
    }

    onUpdate(): void {
        // console.log('onUpdate')
    }
}
