import { Behaviour } from "../engine/Behaviour";

export class Click extends Behaviour {
    onStart(): void {
        this.gameObject.onClick  = () =>{
            console.log('clicked');
        }
    }
}
