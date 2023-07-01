import { getGameObjectById, Matrix } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { invertMatrix, matrixAppendMatrix } from "../engine/math";
import { Transform } from "../engine/Transform";


export class Camera extends Behaviour {
    viewportWidth: number = 1920;
    viewportHeight: number = 1080;

    constructor() {
        super();
    }

    onStart(): void {
        console.log("camera start");
        // 监听键盘按下事件
        window.addEventListener("keydown", function (event) {
            // 获取用户按下的键
            var key = event.key;
            const cameraTransform = getGameObjectById("Camera").getBehaviour(Transform);

            // 根据键执行相应的操作
            switch (key) {
                case "w":
                    // 用户按下了 W 键
                    console.log("W key pressed");
                    cameraTransform.y -= 10;
                    break;
                case "a":
                    // 用户按下了 A 键
                    console.log("A key pressed");
                    cameraTransform.x -= 10;
                    break;
                case "s":
                    // 用户按下了 S 键
                    console.log("S key pressed");
                    cameraTransform.y += 10;
                    break;
                case "d":
                    // 用户按下了 D 键
                    console.log("D key pressed");
                    cameraTransform.x += 10;
                    break;
                default:
                    // 用户按下了其他键
                    break;
            }
        });

    }

    calculateViewportMatrix() {
        const cameraTransform = this.gameObject.getBehaviour(Transform);
        const offsetMatrix = new Matrix(1, 0, 0, 1, 0, 0);
        let viewportMatrix = invertMatrix(matrixAppendMatrix(cameraTransform.globalMatrix, offsetMatrix));
        return viewportMatrix;
    }

    onUpdate(): void {
        //wasd移动相机


    }
}
