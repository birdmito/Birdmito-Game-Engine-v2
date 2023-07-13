import { s } from "vitest/dist/types-2b1c412e";
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
    @string()
    source = '';

    @string()
    loop = false;
    @string()
    autoPlay = false;
    @string()
    mute = false;

    @string()
    startTime = 0;
    @string()
    endTime = 0;
    @string()
    volume = 1;
    @string()
    playbackRate = 1;
    _currentTime = 0;
    _duration = 0;

    _state: 'start' | 'play' | 'playing' | 'pause' | 'stop' = 'stop';

    audioElement: HTMLAudioElement | undefined;
    sourceNode: MediaElementAudioSourceNode | undefined;
    gainNode: GainNode | undefined;

    /**
     * @description 播放音频  
     * 设置音频的播放状态为play，从startTime开始播放
     */
    play(): void {
        this._state = 'start';
    }
    /**
     * @description 暂停音频
     * 设置音频的播放状态为pause, 暂停播放
     */
    pause(): void {
        this._state = 'pause';
    }
    /**
     * @description 继续播放音频（暂未实现）
     * 设置音频的播放状态为play, 继续播放
     */
    continue(): void {
        this._state = 'play';
    }
    /**
     * @description 停止播放音频
     * 设置音频的播放状态为stop, 停止播放, 并将currentTime设置为startTime
     */
    stop(): void {
        this._state = 'stop';
    }
    /**
     * 
     * @returns 是否播放中
     */
    isPlaying(): boolean {
        return this._state === 'playing';
    }
    /**
     * 
     * @returns 是否播放完毕
     */
    isEnded(): boolean {
        return this._state === 'stop';
    }
    /**
     * @description 获取音频Clip总时间
     */
    get duration(): number {
        return this._duration;
    }
    /**
     * @description 获取音频Clip当前播放时间
     */
    get currentTime(): number {
        return this._currentTime;
    }
    /**
     * @description 获取音频Clip状态
     */
    get state(): string {
        return this._state;
    }
}
