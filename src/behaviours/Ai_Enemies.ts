import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";

export class Ai_Enemies extends Behaviour {

    onStart(): void {
    }

    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            console.log('enemies is cliceked')
        }
    }

}
