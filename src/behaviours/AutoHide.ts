import { Behaviour } from "../engine/Behaviour";

export class AutoHide extends Behaviour {
    onStart(): void {
        // for (let child of this.gameObject.children) {
        //     child.active = false
        // }
        this.gameObject.parent.onMouseEnter = () => {
            this.gameObject.active = true
            // for (let child of this.gameObject.children) {
            //     child.active = true
            // }
        }
        this.gameObject.parent.onMouseLeave = () => {
            this.gameObject.active = false
            // for (let child of this.gameObject.children) {
            //     child.active = false
            // }
        }
    }
}
