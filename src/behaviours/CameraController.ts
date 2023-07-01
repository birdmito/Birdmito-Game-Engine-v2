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
    }

    onUpdate(): void {
    }
}
