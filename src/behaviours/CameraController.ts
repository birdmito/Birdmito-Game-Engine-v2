import { Point, Rectangle } from "electron";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { checkPointInRectangle } from "../engine/math";

export class CameraController extends Behaviour {
    // 鼠标移动之边缘检测盒(dev: 1600 945)   1500*1080  1720*980  DYS: 1620*980
    screenPreset: Rectangle = { x: 0, y: 0, width: 1620, height: 980 };     //如果边缘检测盒和不起效，请修改这里调试
    boardWidth: number = 50;   //边缘检测盒范围宽度

    leftRectangle: Rectangle = { x: 0, y: 0, width: this.boardWidth, height: this.screenPreset.height };
    rightRectangle: Rectangle = { x: 1900, y: 0, width: this.boardWidth, height: this.screenPreset.height };
    topRectangle: Rectangle = { x: 0, y: 0, width: this.screenPreset.width, height: this.boardWidth };
    bottomRectangle: Rectangle = { x: 0, y: this.screenPreset.height, width: this.screenPreset.width, height: this.boardWidth };
    mousePoint: Point = { x: 500, y: 500 };

    onStart(): void {
        // const transform = this.gameObject.getBehaviour(Transform);
        console.log(getGameObjectById("CameraRoot"))
        const transform = getGameObjectById("CameraRoot").getBehaviour(Transform);
        
        window.addEventListener('mousemove', (event) => {
            const point = { x: event.clientX, y: event.clientY };
            this.mousePoint = point;
            // console.log(point);
        });
        
        const maxScale = 1.5;
        const minScale = 0.7;
        // 监听鼠标滚轮事件
        window.addEventListener("wheel", function (event) {
            // 检查滚动方向
            if (event.deltaY < 0) {
                // 用户向上滚动
                console.log("Mouse wheel up");
                transform.scaleX -= 0.02;
                transform.scaleY -= 0.02;
                transform.scaleX = Math.max(minScale, transform.scaleX);
                transform.scaleY = Math.max(minScale, transform.scaleY);

            } else if (event.deltaY > 0) {
                // 用户向下滚动
                console.log("Mouse wheel down");
                transform.scaleX += 0.02;
                transform.scaleY += 0.02;
                transform.scaleX = Math.min(maxScale, transform.scaleX);
                transform.scaleY = Math.min(maxScale, transform.scaleY);
            }
        });

    }

    onUpdate(): void {
        //TODO 解决边缘易懂与边缘UI的冲突
        // 六边形地图 30*30个 每个六边形172*200
        const transform = getGameObjectById("CameraRoot").getBehaviour(Transform);

        document.addEventListener("keydown", (event) => {
            //wasd移动摄像机
            if (event.key == "a") {
                transform.x -= 0.1;
                transform.x = Math.max(-300, transform.x);
            }
            if (event.key == "d") {
                transform.x += 0.1;
                transform.x = Math.min(5460, transform.x);
            }
            if (event.key == "w") {
                transform.y -= 0.1;
                transform.y = Math.max(-100, transform.y);
            }
            if (event.key == "s") {
                transform.y += 0.1;
                transform.y = Math.min(4500, transform.y);
            }
        })

        if(checkPointInRectangle(this.mousePoint, this.leftRectangle)){
            transform.x -= 10;
            transform.x = Math.max(-300, transform.x);
        }
        else if(checkPointInRectangle(this.mousePoint, this.rightRectangle)){
            transform.x += 10;
            transform.x = Math.min(5460, transform.x);
        }
        else if(checkPointInRectangle(this.mousePoint, this.topRectangle)){
            transform.y -= 10;
            transform.y = Math.max(-100, transform.y);
        }
        else if(checkPointInRectangle(this.mousePoint, this.bottomRectangle)){
            transform.y += 10;
            transform.y = Math.min(4500, transform.y);
        }
    }

    onEnd(): void {
        window.removeEventListener("keydown", () => { });
        window.removeEventListener("wheel", () => { });
    }
}
