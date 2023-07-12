import { Behaviour } from "../engine/Behaviour";

export class DisactiveSelfOnStart extends Behaviour {
    isOnStart: boolean = true
    onStart(): void {
        if (this.isOnStart) {
            console.log("start")
            this.gameObject.active = false
            this.isOnStart = false
        }
        else {
            return
        }
    }
}
