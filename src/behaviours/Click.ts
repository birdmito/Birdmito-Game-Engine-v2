import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";

export class Click extends Behaviour {
    onStart(): void {
        const audioClips = this.gameObject.getBehaviours(AudioClip)
        console.log(this.gameObject.getBehaviours(AudioClip));

        function test(){
            console.log('test');
        }
        this.gameObject.onMouseLeftUpList.push(test);

        this.gameObject.onClick  = () =>{
            console.log('left click');
        }
        this.gameObject.onMouseLeftDown  = () =>{
            audioClips[0].play();
            console.log('left down');
        }
        this.gameObject.onMouseRightDown  = () =>{
            console.log('right down');
        }
        this.gameObject.onMouseMiddleDown  = () =>{
            console.log('middle down');
        }
        this.gameObject.onMouseEnter  = () =>{
            audioClips[1].play();
            console.log(`${this.gameObject.id} enter`);
        }
        this.gameObject.onMouseLeave  = () =>{
            // console.log(`${this.gameObject.id} leave`);
        }
        this.gameObject.onMouseHover  = () =>{
            // console.log(`${this.gameObject.id} hover`);
        }
    }
}

// backup ---------------
// if(audioClip.isPlaying()){
//     console.log('pause');
//     audioClip.pause();
// }
// else{
//     console.log('play');
//     audioClip.play();
// }
