import { Point } from "electron";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";

export class CameraController extends Behaviour {
    // 拖拽移动相关
    private isDragging: boolean = false;
    private lastMousePos: Point = { x: 0, y: 0 };
    private dragButton: number = 1; // 0=左键, 1=中键, 2=右键

    // 边界限制
    private minX: number = -300;
    private maxX: number = 5460;
    private minY: number = -100;
    private maxY: number = 4500;

    onStart(): void {
        const transform = getGameObjectById("CameraRoot").getBehaviour(Transform);

        const maxScale = 1.5;
        const minScale = 0.7;

        // 监听鼠标按下事件 - 开始拖拽
        window.addEventListener('mousedown', (event) => {
            if (event.button === this.dragButton) {
                this.isDragging = true;
                this.lastMousePos = { x: event.clientX, y: event.clientY };
                // 阻止右键菜单
                if (this.dragButton === 2) {
                    event.preventDefault();
                }
            }
        });

        // 监听鼠标移动事件 - 执行拖拽
        window.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                const deltaX = event.clientX - this.lastMousePos.x;
                const deltaY = event.clientY - this.lastMousePos.y;

                // 更新相机位置（注意方向相反，拖动时镜头反向移动）
                transform.x -= deltaX / transform.scaleX;
                transform.y -= deltaY / transform.scaleY;

                // 限制边界
                transform.x = Math.max(this.minX, Math.min(this.maxX, transform.x));
                transform.y = Math.max(this.minY, Math.min(this.maxY, transform.y));

                // 更新上一次鼠标位置
                this.lastMousePos = { x: event.clientX, y: event.clientY };
            }
        });

        // 监听鼠标松开事件 - 结束拖拽
        window.addEventListener('mouseup', (event) => {
            if (event.button === this.dragButton) {
                this.isDragging = false;
            }
        });

        // 监听右键菜单事件 - 阻止默认行为
        if (this.dragButton === 2) {
            window.addEventListener('contextmenu', (event) => {
                if (this.isDragging) {
                    event.preventDefault();
                }
            });
        }

        // 监听鼠标滚轮事件 - 缩放
        window.addEventListener("wheel", (event) => {
            if (event.deltaY < 0) {
                // 向上滚动 - 放大
                transform.scaleX -= 0.02;
                transform.scaleY -= 0.02;
                transform.scaleX = Math.max(minScale, transform.scaleX);
                transform.scaleY = Math.max(minScale, transform.scaleY);
            } else if (event.deltaY > 0) {
                // 向下滚动 - 缩小
                transform.scaleX += 0.02;
                transform.scaleY += 0.02;
                transform.scaleX = Math.min(maxScale, transform.scaleX);
                transform.scaleY = Math.min(maxScale, transform.scaleY);
            }
        });
    }

    onUpdate(): void {
        const transform = getGameObjectById("CameraRoot").getBehaviour(Transform);

        // WASD 键盘移动摄像机（保留作为备选操作方式）
        document.addEventListener("keydown", (event) => {
            const moveSpeed = 10;

            if (event.key === "a" || event.key === "A") {
                transform.x -= moveSpeed;
                transform.x = Math.max(this.minX, transform.x);
            }
            if (event.key === "d" || event.key === "D") {
                transform.x += moveSpeed;
                transform.x = Math.min(this.maxX, transform.x);
            }
            if (event.key === "w" || event.key === "W") {
                transform.y -= moveSpeed;
                transform.y = Math.max(this.minY, transform.y);
            }
            if (event.key === "s" || event.key === "S") {
                transform.y += moveSpeed;
                transform.y = Math.min(this.maxY, transform.y);
            }
        });
    }

    onEnd(): void {
        // 清理事件监听器
        // 注意：这里只是示例，实际应该保存监听器引用以便正确移除
        window.removeEventListener("keydown", () => { });
        window.removeEventListener("wheel", () => { });
        window.removeEventListener("mousedown", () => { });
        window.removeEventListener("mousemove", () => { });
        window.removeEventListener("mouseup", () => { });
        window.removeEventListener("contextmenu", () => { });
    }
}
