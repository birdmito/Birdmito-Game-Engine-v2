import { GameObject } from "../../engine";
import { AudioClip } from "../AudioClip";
import { Behaviour } from "../Behaviour";
import { clamp } from "../math";
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
            if(component.source === undefined){
                throw new Error(`AudioClip: ${component.source} source is undefined`); 
            }
            if(component.name === undefined){
                // 只保留source的文件名
                component.name = component.source.split('/').pop()?.split('.')[0];
            }

            // 加载音频
            // OPTIMIZE 解决不同场景加载相同音频时audioElement已被连接至其他AudioContext的问题（可能原因：audioElement被缓存、未成功disconnect）
            component.audioElement = this.gameEngine.resourceManager.getAudio(component.source);

            // 设置音频属性
            //#region 音频属性设置
            if(component.audioElement){
                // 设置开始/结束时间
                if(component.startTime === undefined){
                    // console.log(`AudioClip: ${component.source} startTime is undefined, set to 0`);
                    component.startTime = 0;
                }
                if(component.startTime < 0){
                    console.warn(`AudioClip: ${component.source} startTime is out of range, set to 0`);
                    component.startTime = 0;
                }
                if(component.startTime > component.audioElement.duration){
                    // component.startTime = component.audioElement.duration;
                    throw new Error(`AudioClip: ${component.source} startTime is out of range`);
                }
                component._currentTime = component.startTime;
                if(component.endTime === undefined){
                    // console.log(`AudioClip: ${component.source} endTime is undefined, set to ${component.audioElement.duration}`);
                    component.endTime = component.audioElement.duration;
                }
                if(component.endTime < 0){
                    throw new Error(`AudioClip: ${component.source} endTime is out of range`);
                }
                if(component.endTime > component.audioElement.duration){
                    console.warn(`AudioClip: ${component.source} endTime is out of range, set to ${component.audioElement.duration}`);
                    component.endTime = component.audioElement.duration;
                }
                // 持续时间
                component._duration = component.endTime - component.startTime;
                // 设置音量
                if(component.volume === undefined){
                    component.volume = 1;
                }
                // 设置播放速率
                if(component.playbackRate === undefined){
                    component.playbackRate = 1;
                }
                component.playbackRate = clamp(component.playbackRate, 0.5, 2);
                // 设置自动播放
                if(component.autoPlay === undefined){ 
                    component.autoPlay = false; 
                }
                if(component.autoPlay == true){
                    component._state = 'play';
                }
                // 设置循环播放
                if(component.loop === undefined){
                    component.loop = false;
                }
                // 设置静音
                if(component.mute === undefined){
                    component.mute = false;
                }
                // #endregion

                // 创建音频源
                component.sourceNode = this.audioContext?.createMediaElementSource(component.audioElement);
                // 创建音量控制节点
                component.gainNode = this.audioContext?.createGain();
                component.gainNode.gain.value = clamp(component.volume, -3, 3);
                // 连接节点
                component.sourceNode.connect(component.gainNode).connect(this.audioContext.destination);
                this.gameObjects.push(gameObject);
            }
        }
    }

    onRemoveComponent(gameObject: GameObject, component: Behaviour): void {
        // 移除GameObject
        if (component instanceof AudioClip) {
            component.audioElement?.pause();
            component.sourceNode?.disconnect();
            component.gainNode?.disconnect();
            component.sourceNode = undefined;
            component.gainNode = undefined;
            component.audioElement = undefined;

            this.gameObjects = this.gameObjects.filter((item) => item !== gameObject);
        }
    }

    onUpdate(): void {
        for(const gameObject of this.gameObjects){
            const audioClips = gameObject.getBehaviours(AudioClip);
            for(const audioClip of audioClips){
                if(!audioClip.sourceNode){ continue; }  // 如果没有音频源，则跳过

                // 音频属性设置
                audioClip.sourceNode.mediaElement.loop = audioClip.loop;
                audioClip.sourceNode.mediaElement.playbackRate = audioClip.playbackRate;
                audioClip.gainNode.gain.value = clamp(audioClip.volume, -3, 3);
                if(audioClip.mute){ // 静音
                    audioClip.gainNode.gain.value = 0;
                }
    
                // 根据状态执行操作
                switch(audioClip._state){
                    case 'start':
                        if(audioClip.audioElement){
                            audioClip._currentTime = audioClip.startTime;
                            audioClip._state = 'play';
                            // console.log('System start');
                        }
                        break;
                    case 'play':
                        if(audioClip.audioElement){
                            audioClip.audioElement.currentTime = audioClip._currentTime;
                            audioClip.audioElement.play();
                            audioClip._state = 'playing';
                            // console.log('System play');
                        }
                        break;
                    case 'playing':
                        if(audioClip.audioElement){
                            audioClip._currentTime = audioClip.audioElement.currentTime;
                            if(audioClip._currentTime >= audioClip.endTime){
                                if(audioClip.loop){break;}
                                audioClip._state = 'stop';
                            }
                            // console.log('System playing');
                        }
                        break;
                    case 'pause':
                        if(audioClip.audioElement){
                            audioClip.audioElement.pause();
                            audioClip._currentTime = audioClip.audioElement.currentTime;
                            // console.log('System pause');
                        }
                        break;
                    case 'stop':
                        if(audioClip.audioElement){
                            audioClip.audioElement.pause();
                            audioClip._currentTime = audioClip.startTime;
                            // console.log('System stop');
                        }
                        break;
                }
            }
        }
    }

}