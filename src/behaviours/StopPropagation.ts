import { Behaviour } from "../engine/Behaviour";

export class StopPropagation extends Behaviour {
    onStart(): void {
        this.gameObject.stopPropagation = true;
    }
}
