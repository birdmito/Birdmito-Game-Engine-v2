import { Point, Rectangle } from "electron";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { Camera } from "./Camera";
import { checkPointInRectangle } from "../engine/math";

export class CameraController extends Behaviour {
    //TODO: 鼠标拖动移动相机
    // 鼠标移动之边缘检测盒(dev: 1600 945)
    leftRectangle: Rectangle = { x: 0, y: 0, width: 100, height: 1080 };
    rightRectangle: Rectangle = { x: 1620, y: 0, width: 100, height: 1080 };
    topRectangle: Rectangle = { x: 0, y: 0, width: 1920, height: 100 };
    bottomRectangle: Rectangle = { x: 0, y: 880, width: 1920, height: 100 };
    mousePoint: Point = { x: 500, y: 500 };

    onStart(): void {
        // const transform = this.gameObject.getBehaviour(Transform);
        console.log(getGameObjectById("CameraRoot"))
        const transform = getGameObjectById("CameraRoot").getBehaviour(Transform);
        
        window.addEventListener('mousemove', (event) => {
            const point = { x: event.clientX, y: event.clientY };
            this.mousePoint = point;
        });


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
                transform.scaleX -= 0.02;
                transform.scaleY -= 0.02;
                transform.scaleX = Math.max(0.7, transform.scaleX);
                transform.scaleY = Math.max(0.7, transform.scaleY);

            } else if (event.deltaY > 0) {
                // 用户向下滚动
                console.log("Mouse wheel down");
                transform.scaleX += 0.02;
                transform.scaleY += 0.02;
                transform.scaleX = Math.min(1.5, transform.scaleX);
                transform.scaleY = Math.min(1.5, transform.scaleY);
            }
        });

    }

    onUpdate(): void {
        const transform = getGameObjectById("CameraRoot").getBehaviour(Transform);

        if(checkPointInRectangle(this.mousePoint, this.leftRectangle)){
            transform.x -= 10;
        }
        else if(checkPointInRectangle(this.mousePoint, this.rightRectangle)){
            transform.x += 10;
        }
        else if(checkPointInRectangle(this.mousePoint, this.topRectangle)){
            transform.y -= 10;
        }
        else if(checkPointInRectangle(this.mousePoint, this.bottomRectangle)){
            transform.y += 10;
        }

    }

    // TODO 回到主界面移除监听
    onEnd(): void {
        window.removeEventListener("keydown", () => { });
        window.removeEventListener("wheel", () => { });
    }
}
