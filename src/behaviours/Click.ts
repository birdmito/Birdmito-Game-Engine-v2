import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";

export class Click extends Behaviour {
    onStart(): void {
        const audioClip = this.gameObject.getBehaviour(AudioClip)
        let isPause = true;

        audioClip.play();
        
        this.gameObject.onClick  = () =>{
            console.log('left click');
        }
        this.gameObject.onMouseLeftDown  = () =>{
            audioClip.startTime = 60;
            audioClip.endTime = 70;
            if(isPause){
                audioClip.continue();
                isPause = false;
            }
            else{
                audioClip.pause();
                isPause = true;
            }

            console.log('left down');
        }
        this.gameObject.onMouseRightDown  = () =>{
            console.log('right down');
        }
        this.gameObject.onMouseMiddleDown  = () =>{
            console.log('middle down');
        }
        this.gameObject.onMouseEnter  = () =>{
            console.log(`${this.gameObject.id} enter`);
        }
        this.gameObject.onMouseLeave  = () =>{
            console.log(`${this.gameObject.id} leave`);
        }
    }
}
