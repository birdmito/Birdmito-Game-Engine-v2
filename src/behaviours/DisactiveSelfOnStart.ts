import { Behaviour } from "../engine/Behaviour";

export class DisactiveSelfOnStart extends Behaviour {
    onStart(): void {
        this.gameObject.active = false
    }
}
