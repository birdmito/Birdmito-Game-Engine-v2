import { GameObject } from "../../engine";
import { AudioClip } from "../AudioClip";
import { Behaviour } from "../Behaviour";
import { System } from "./System";

export class AudioSystem extends System{
    private gameObjects: GameObject[] = [];     // 存储所有AudioClip组件的gameObject
    private audioContext: AudioContext | undefined;

    constructor(){
        super();
        this.audioContext = new AudioContext();
    }
    
    onAddComponent(gameObject: GameObject, component: Behaviour): void {
        // 加载音频
        if (component instanceof AudioClip) {
            component.audioElement = this.gameEngine.resourceManager.getAudio(component.source);
            if(component.audioElement){
                component.startTime = 0;
                component.endTime = component.audioElement.duration;
                component.duration = component.endTime - component.startTime;
                component.sourceNode = this.audioContext?.createMediaElementSource(component.audioElement);
                // component.sourceNode.connect(this.audioContext!.destination);
                this.gameObjects.push(gameObject);
            }
        }
    }

    onRemoveComponent(gameObject: GameObject, component: Behaviour): void {
        // 移除GameObject
        if (component instanceof AudioClip) {
            this.gameObjects = this.gameObjects.filter((item) => item !== gameObject);
        }
    }

    onUpdate(): void {
        //TODO 设置音量等操作
        for(const gameObject of this.gameObjects){
            const audioClip = gameObject.getBehaviour(AudioClip);
            if(!audioClip.sourceNode){ continue; }  // 如果没有音频源，则跳过
            // 连接节点
            audioClip.sourceNode.mediaElement.loop = audioClip.loop;
            audioClip.sourceNode.connect(this.audioContext!.destination);

            // 根据状态执行操作
            switch(audioClip._state){
                case 'play':
                    if(audioClip.audioElement){
                        audioClip.audioElement.currentTime = audioClip.currentTime;
                        audioClip.audioElement.play();
                        audioClip._state = 'playing';
                        // console.log('System play');
                    }
                    break;
                case 'playing':
                    if(audioClip.audioElement){
                        audioClip.currentTime = audioClip.audioElement.currentTime;
                        if(audioClip.currentTime >= audioClip.endTime){
                            if(audioClip.loop){break;}
                            audioClip._state = 'stop';
                        }
                        // console.log('System playing');
                    }
                    break;
                case 'pause':
                    if(audioClip.audioElement){
                        audioClip.audioElement.pause();
                        audioClip.currentTime = audioClip.audioElement.currentTime;
                        // console.log('System pause');
                    }
                    break;
                case 'stop':
                    if(audioClip.audioElement){
                        audioClip.audioElement.pause();
                        audioClip.currentTime = audioClip.startTime;
                        // console.log('System stop');
                    }
                    break;
            }
            
        }
    }

}