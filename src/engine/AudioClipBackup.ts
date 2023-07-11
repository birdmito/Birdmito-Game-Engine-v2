import { Behaviour } from "./Behaviour";
import { string } from "./validators/string";

/**
 * 音频组件
 * @category Behaviour
 * @description   音频组件(Behaviour)，用于播放音频:  
 * * 设置：提供了播放play、暂停pause、继续continue、停止stop、设置开始/结束时间startTime/endTime、设置音量volume、设置播放速度playBackRate、切换静音toggleMute、设置循环播放loop等功能  
 * * 获取：提供了获取开始/结束时间startTime/endTime、当前播放时间currentTime、获取总播放时间duration、获取是否播放中isPlaying、获取是否播放完毕isEnded等功能
 */
export class AudioClipBackup extends Behaviour {
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

    private _startTime = 0;
    private _endTime = 0;
    private _duration = 0;

    private pausePosition = 0;
    private _audio: HTMLAudioElement | null = null;
    
    onUpdate(): void {
        if(this._audio){
            if(this._audio.currentTime > this._endTime){
                this.stop();
            }
        }
    }

    // base
    // ---------------------------
    play() {
        if (this._audio) {
            console.log('play');
            this._audio.play();
            this._audio.currentTime = this._startTime;
        }
    }
    pause() {
        console.log('pause');
        this._audio?.pause();
        this.pausePosition = this._audio?.currentTime || 0;
    }

    continue() {
        console.log('continue');
        this._audio?.play();
        this._audio.currentTime = this.pausePosition;
    }

    stop() {
        if (this._audio) {
            this._audio.pause();
            this._audio.currentTime = this._startTime;
        }
    }

    // getter
    // ---------------------------
    get startTime() {
        return this._startTime;
    }

    get endTime() {
        return this._endTime;
    }

    get duration() {
        return this._duration;
    }

    get audio() {
        return this._audio;
    }

    isPlaying() {
        if (this._audio) {
            return !this._audio.paused;
        }
        return false;
    }
    
    isEnded() {
        if (this._audio) {
            return this._audio.ended;
        }
        return false;
    }

    currentTime() {
        if (this._audio) {
            return this._audio.currentTime;
        }
        return 0;
    }

    // setter
    // ---------------------------
    set startTime(time: number) {
        this._startTime = time;
    }

    set endTime(time: number) {
        this._endTime = time;
    }

    set audio(audio: HTMLAudioElement | null) {
        this._audio = audio;
    }

    set duration(duration: number) {
        this._duration = duration;
    }

    loop(isLoop: boolean) {
        if (this._audio) {
            this._audio.loop = isLoop;
        }
    }

    set volume(volume: number) {
        if (this._audio) {
            this._audio.volume = volume;
        }
    }

    toggleMute(isMute: boolean) {
        if (this._audio) {
            this._audio.muted = isMute;
        }
    }

    set playbackRate(playbackRate: number) {
        if (this._audio) {
            this._audio.playbackRate = playbackRate;
        }
    }

    
}
