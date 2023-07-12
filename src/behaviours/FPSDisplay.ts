import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";

export class FPSDisplay extends Behaviour {
    lastTime: number = performance.now();
    frameCount: number = 0;
    frameTime: number = 0;
    fps: number = 0;
    onUpdate(): void {
        //计算每秒帧数
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;
        this.frameCount++;
        this.frameTime += delta;
        if (this.frameTime > 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.frameTime = 0;
            this.gameObject.getBehaviour(TextRenderer).text = 'FPS:' + this.fps.toString();
        }
    }
}
