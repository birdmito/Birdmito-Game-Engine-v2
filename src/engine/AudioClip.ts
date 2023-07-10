import { Behaviour } from "../engine/Behaviour";
import { string } from "./validators/string";

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

    private _startTime = 0;
    private _endTime = 0;
    private _duration = 0;
    private pausePosition = 0;
    private audio: HTMLAudioElement | null = null;

    onStart(): void {
        this.audio = new Audio(this.source);
        //OPTIMIZE 要不要整合到resourceManager里面
        this.audio.onloadedmetadata = () => {
            this._duration = this.audio?.duration || 0;
            this._startTime = 0;
            this._endTime = this._duration;
        }
    }
    
    onUpdate(): void {
        if(this.audio){
            if(this.audio.currentTime > this._endTime){
                this.stop();
            }
        }
    }

    // base
    // ---------------------------
    play() {
        if (this.audio) {
            console.log('play');
            this.audio.play();
            this.audio.currentTime = this._startTime;
        }
    }
    //OPTIMIZE 暂停和继续的实现方式
    pause() {
        console.log('pause');
        this.audio?.pause();
        this.pausePosition = this.audio?.currentTime || 0;
    }

    continue() {
        console.log('continue');
        this.audio?.play();
        this.audio.currentTime = this.pausePosition;
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = this._startTime;
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

    isPlaying() {
        if (this.audio) {
            return !this.audio.paused;
        }
        return false;
    }
    
    isEnded() {
        if (this.audio) {
            return this.audio.ended;
        }
        return false;
    }

    currentTime() {
        if (this.audio) {
            return this.audio.currentTime;
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

    loop(isLoop: boolean) {
        if (this.audio) {
            this.audio.loop = isLoop;
        }
    }

    setVolume(volume: number) {
        if (this.audio) {
            this.audio.volume = volume;
        }
    }

    toggleMute(isMute: boolean) {
        if (this.audio) {
            this.audio.muted = isMute;
        }
    }

    setPlaybackRate(playbackRate: number) {
        if (this.audio) {
            this.audio.playbackRate = playbackRate;
        }
    }

    
}
