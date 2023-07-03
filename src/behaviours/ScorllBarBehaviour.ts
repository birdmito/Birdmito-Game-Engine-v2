import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";

export class ScrollBarBehaviour extends Behaviour {
    onStart(): void {
        
    }

    onUpdate(): void {

        this.gameObject.onMouseLeftDown = () =>{
            console.log('container is clicked')
        }

        this.gameObject.children[0].onMouseLeftDown = () => {
            console.log('textArea is clicked')
        }

        this.gameObject.children[0].onMouseLeftDown = () => {
            console.log('scrollbar is clicked')
        }
    }
}