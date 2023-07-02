import { Behaviour } from "../engine/Behaviour";

export class Click extends Behaviour {
    onStart(): void {
        this.gameObject.onClick  = () =>{
            console.log('left click');
        }
        this.gameObject.onMouseLeftDown  = () =>{
            console.log('left down');
        }
        this.gameObject.onMouseRightDown  = () =>{
            console.log('right down');
        }
        this.gameObject.onMouseMiddleDown  = () =>{
            console.log('middle down');
        }
    }
}
