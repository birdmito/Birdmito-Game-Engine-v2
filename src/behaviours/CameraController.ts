import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";

export class CameraController extends Behaviour {
    onStart(): void {
        const transform = this.gameObject.getBehaviour(Transform);
        window.addEventListener("keydown", (event) => {
            const code = event.code;
            const scale = event.shiftKey ? 10 : 1;
            if (code === "KeyW") {
                transform.y -= 10 * scale;
            } else if (code === "KeyS") {
                transform.y += 10 * scale;
            } else if (code === "KeyA") {
                transform.x -= 10 * scale;
            } else if (code === "KeyD") {
                transform.x += 10 * scale;
            }
        });

        // 监听鼠标滚轮事件
        window.addEventListener("wheel", function (event) {
            // 检查滚动方向
            if (event.deltaY < 0) {
                // 用户向上滚动
                console.log("Mouse wheel up");
                getGameObjectById("sceneRoot").getBehaviour(Transform).scaleX += 0.1;
                getGameObjectById("sceneRoot").getBehaviour(Transform).scaleY += 0.1;
            } else if (event.deltaY > 0) {
                // 用户向下滚动
                console.log("Mouse wheel down");
                getGameObjectById("sceneRoot").getBehaviour(Transform).scaleX -= 0.1;
                getGameObjectById("sceneRoot").getBehaviour(Transform).scaleY -= 0.1;
            }
        });

    }

    onUpdate(): void {
    }
}
