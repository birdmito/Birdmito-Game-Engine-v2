import { Behaviour } from "../engine/Behaviour";
import { string } from "./validators/string";

/**
 * 音频组件
 * @category Component
 * @description   音频组件(ECS)，用于播放音频:  
 * * 设置：提供了播放play、暂停pause、继续continue、停止stop、设置开始/结束时间startTime/endTime、设置音量volume、设置播放速度playBackRate、切换静音mute、设置循环播放loop等功能  
 * * 获取：提供了获取开始/结束时间startTime/endTime、当前播放时间currentTime、获取总播放时间duration、获取是否播放中isPlaying、获取是否播放完毕isEnded等功能
 */
export class AudioClip extends Behaviour {
    // pause(): 暂停音频的播放。
    // currentTime: 获取或设置音频的当前播放时间（以秒为单位）。
    // duration: 获取音频的总播放时间（以秒为单位）。
    // volume: 获取或设置音频的音量，范围从0.0（静音）到1.0（最大音量）。
    // muted: 获取或设置音频的静音状态。
    // loop: 获取或设置音频是否循环播放。
    // ended: 表示音频是否已经播放完毕。
    // playbackRate: 获取或设置音频的播放速度，默认值为1.0。
    @string()
    source = '';

    startTime = 0;
    endTime = 0;
    duration = 0;
    volume = 1;
    playBackRate = 1;
    currentTime = 0;
    loop = false;

    _state: 'play' | 'playing' | 'pause' | 'stop' = 'stop';

    audioElement: HTMLAudioElement | undefined;
    sourceNode: MediaElementAudioSourceNode | undefined;

    play(): void {
        this._state = 'play';
    }

    pause(): void {
        this._state = 'pause';
    }

    continue(): void {
        this._state = 'play';
    }

    stop(): void {
        this._state = 'stop';
    }
    isPlaying(): boolean {
        return this._state === 'playing';
    }
}
