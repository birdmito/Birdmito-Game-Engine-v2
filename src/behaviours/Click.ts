import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";

export class Click extends Behaviour {
    onStart(): void {
        const audioClip = this.gameObject.getBehaviour(AudioClip)
        audioClip.loop = true;
        this.gameObject.onClick  = () =>{
            console.log('left click');
        }
        this.gameObject.onMouseLeftDown  = () =>{
            console.log(audioClip._state)
            if(audioClip.isPlaying()){
                console.log('pause');
                audioClip.pause();
            }
            else{
                console.log('play');
                audioClip.play();
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
        this.gameObject.onMouseHover  = () =>{
            // console.log(`${this.gameObject.id} hover`);
        }
    }
}
