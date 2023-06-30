import { Camera } from "../../behaviours/Camera";
import { ShapeRectRenderer } from "../../behaviours/unneed/ShapeRectRenderer";
import { GameObject, getGameObjectById } from "../../engine";
import { AnimationRenderer } from "../AnimationRenderer";
import { Behaviour } from "../Behaviour";
import { BitmapRenderer } from "../BitmapRenderer";
import { matrixAppendMatrix } from "../math";
import { TextRenderer } from "../TextRenderer";
import { Transform } from "../Transform";
import { System } from "./System";

export class CanvasContextRenderingSystem extends System {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    getContext() {
        return this.context;
    }
    getCanvas() {
        return this.canvas;
    }

    constructor() {
        super();
        const canvas = document.getElementById("game") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        canvas.style.width = viewportWidth + "px";
        canvas.style.height = viewportHeight + "px";
        canvas.width = viewportWidth;
        canvas.height = viewportHeight;
        context.font = "40px Arial";
        this.context = context;
        this.canvas = canvas;
    }

    onAddComponent(gameObject: GameObject, component: Behaviour): void {
        if (
            component instanceof ShapeRectRenderer ||
            component instanceof TextRenderer ||
            component instanceof BitmapRenderer ||
            component instanceof AnimationRenderer
        ) {
            gameObject.renderer = component;
        }
    }

    onRemoveComponent(gameObject: GameObject, component: Behaviour): void {
        if (
            component instanceof ShapeRectRenderer ||
            component instanceof TextRenderer ||
            component instanceof BitmapRenderer ||
            component instanceof AnimationRenderer
        ) {
            gameObject.renderer = null;
        }
    }

    onUpdate(): void {
        const context = this.context;
        // const canvas = this.canvas;
        // context.setTransform(1, 0, 0, 1, 0, 0);
        // context.clearRect(0, 0, canvas.width, canvas.height);

        const cameraGameObject =
            this.gameEngine.mode === "play" ? getGameObjectById("camera") : this.gameEngine.editorGameObject;
        
        const camera = cameraGameObject.getBehaviour(Camera);
        const viewportMatrix = camera.calculateViewportMatrix();

        const self = this;

        function visitChildren(gameObject: GameObject) {
            for (const child of gameObject.children) {
                if (child.renderer) {
                    const transform = child.getBehaviour(Transform);
                    const matrix = matrixAppendMatrix(transform.globalMatrix, viewportMatrix);
                    context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                    if (child.renderer instanceof TextRenderer) {
                        const renderer = child.renderer as TextRenderer;
                        context.font = renderer.fontSize + "px" + " " + renderer.fontFamily;
                        //设置字体颜色
                        if (renderer.color)
                            context.fillStyle = renderer.color;
                        context.fillText(renderer.text, renderer.anchor.x, renderer.anchor.y);
                        renderer.measuredTextWidth = context.measureText(renderer.text).width;
                    } else if (child.renderer instanceof ShapeRectRenderer) {
                        const renderer = child.renderer as ShapeRectRenderer;
                        context.save();
                        context.fillStyle = renderer.color;
                        context.fillRect(0, 0, renderer.width, renderer.height);
                        context.restore();
                    } else if (child.renderer instanceof BitmapRenderer) {
                        const renderer = child.renderer as BitmapRenderer;
                        context.save();
                        const img = self.gameEngine.resourceManager.getImage(renderer.source);

                        // context.drawImage(img, renderer.anchor.x, renderer.anchor.y);

                        if (renderer.renderType === 'ui') {
                            const originalWidth = img.width;
                            const originalHeight = img.height;

                            // 缩放比例
                            const scaleX = renderer.scaleX;
                            const scaleY = renderer.scaleY;

                            // 边框大小
                            const borderWidth = renderer.borderWidth;

                            // 计算九宫格单元格的大小
                            const cellSize = Math.floor((Math.min(originalWidth, originalHeight) - (borderWidth * 2)));

                            // 绘制九宫格图片
                            //图源、起始点、起始点宽高、绘制点、绘制点宽高
                            context.drawImage(img, 0, 0, borderWidth, borderWidth, renderer.anchor.x, renderer.anchor.y, borderWidth, borderWidth);
                            context.drawImage(img, borderWidth, 0, cellSize, borderWidth, renderer.anchor.x + borderWidth, renderer.anchor.y, cellSize * scaleX, borderWidth);
                            context.drawImage(img, originalWidth - borderWidth, 0, borderWidth, borderWidth, renderer.anchor.x + borderWidth + cellSize * scaleX, renderer.anchor.y, borderWidth, borderWidth);

                            context.drawImage(img, 0, borderWidth, borderWidth, cellSize, renderer.anchor.x, renderer.anchor.y + borderWidth, borderWidth, cellSize * scaleY);
                            context.drawImage(img, borderWidth, borderWidth, cellSize, cellSize, renderer.anchor.x + borderWidth, renderer.anchor.y + borderWidth, cellSize * scaleX, cellSize * scaleY);
                            context.drawImage(img, originalWidth - borderWidth, borderWidth, borderWidth, cellSize, renderer.anchor.x + borderWidth + cellSize * scaleX, renderer.anchor.y + borderWidth, borderWidth, cellSize * scaleY);

                            context.drawImage(img, 0, originalHeight - borderWidth, borderWidth, borderWidth, renderer.anchor.x, renderer.anchor.y + borderWidth + cellSize * scaleY, borderWidth, borderWidth);
                            context.drawImage(img, borderWidth, originalHeight - borderWidth, cellSize, borderWidth, renderer.anchor.x + borderWidth, renderer.anchor.y + borderWidth + cellSize * scaleY, cellSize * scaleX, borderWidth);
                            context.drawImage(img, originalWidth - borderWidth, originalHeight - borderWidth, borderWidth, borderWidth, renderer.anchor.x + borderWidth + cellSize * scaleX, renderer.anchor.y + borderWidth + cellSize * scaleY, borderWidth, borderWidth);

                        }
                        else {// 图片原始尺寸
                            context.drawImage(img, renderer.anchor.x, renderer.anchor.y);
                        }

                        context.restore();
                    } else if (child.renderer instanceof AnimationRenderer) {
                        const renderer = child.renderer as AnimationRenderer;
                        context.save();
                        const img = self.gameEngine.resourceManager.getImage(renderer.source);
                        const sourceRect = renderer.sourceRect;
                        const destinationRect = renderer.getBounds();
                        context.drawImage(
                            img,
                            sourceRect.x,
                            sourceRect.y,
                            sourceRect.width,
                            sourceRect.height,
                            destinationRect.x,
                            destinationRect.y,
                            destinationRect.width,
                            destinationRect.height
                        );
                        context.restore();
                    }
                }
                visitChildren(child);
            }
        }
        visitChildren(this.rootGameObject);
    }
}
