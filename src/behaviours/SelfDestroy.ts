import { Behaviour } from "../engine/Behaviour";

export class SelfDestroy extends Behaviour {
    //延迟
    delay: number = 1;
    private startTime;
    onStart(): void {
        this.startTime = Date.now();
    }
    onUpdate(): void {
        //在delay秒后自毁
        if (Date.now() - this.startTime > this.delay * 1000) {
            this.gameObject.destroy();
        }
    }
}
