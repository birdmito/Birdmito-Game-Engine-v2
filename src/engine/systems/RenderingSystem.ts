import { Camera } from "../../behaviours/Camera";
import { ShapeRectRenderer } from "../../behaviours/unneed/ShapeRectRenderer";
import { GameObject, getGameObjectById, Renderer } from "../../engine";
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
        // 加载BitmapRenderer的图片
        if (component instanceof BitmapRenderer) {
            if (!component.source) {
                throw new Error(`${gameObject.id}'s BitmapRenderer source is null`)
            }
            component.image = this.gameEngine.resourceManager.getImage(component.source)

            component.scaleX = component.scaleXForUI;
            component.scaleY = component.scaleYForUI;
            component.borderWidth = component.borderWidthForUI;

            component.setAnchor(component.anchorType);
        }
        // 加载TextRenderer
        if(component instanceof TextRenderer){

            component.measuredTextWidth = this.context.measureText(component.text).width;
            if(component.lineWidth === undefined){
                component.lineWidth = String(component.measuredTextWidth);
            }
            if(component.lineHeight === undefined){
                component.lineHeight = '1';
            }
            // component.setAnchor(component.anchorType);
        }
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
            this.gameEngine.mode === "play" ? getGameObjectById("Camera") : this.gameEngine.editorGameObject;

        const camera = cameraGameObject.getBehaviour(Camera);
        const viewportMatrix = camera.calculateViewportMatrix();

        const self = this;

        function visitChildren(gameObject: GameObject) {
            for (const child of gameObject.children) {
                if (child.renderer) {
                    if(child.active == false){
                        continue;
                    }
                    const transform = child.getBehaviour(Transform);
                    const matrix = matrixAppendMatrix(transform.globalMatrix, viewportMatrix);
                    context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                    if (child.renderer instanceof TextRenderer) {
                        const renderer = child.renderer as TextRenderer;
                        drawText(context, renderer);
                    } 
                    else if (child.renderer instanceof ShapeRectRenderer) {
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
function drawText(context: CanvasRenderingContext2D, renderer: TextRenderer){
    context.font = renderer.fontSize + "px" + " " + renderer.fontFamily;
    //设置字体颜色
    if (renderer.color) {
        context.fillStyle = renderer.color;
    }
    else {
        context.fillStyle = 'white';
    }
    // 换行
    const lineHeight = renderer.fontSize * Number(renderer.lineHeight);
    const lineWidth = renderer.fontSize * Number(renderer.lineWidth);   //'Button' = 120
    let maxWidth = 0;
    let words = renderer.text.split('');
    let lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
        if(words[i] === '|'){
            lines.push(currentLine);
            currentLine = '';
            continue;
        }
        let word = words[i];
        let width = context.measureText(currentLine + word).width;
        if (width < lineWidth) {
            currentLine += word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
        maxWidth = Math.max(maxWidth,context.measureText(currentLine).width)
    }
    lines.push(currentLine);
    renderer.measuredTextWidth = maxWidth;
    renderer.textHeight = lineHeight * lines.length;
    renderer.setAnchor(renderer.anchorType);
    let drawPoint = { x: 0, y: 0 };
    // console.log(drawPoint)
    // drawPoint.x -= renderer.measuredTextWidth / 2;
    // drawPoint.y += renderer.fontSize;
    // drawPoint.y -= renderer.textHeight / 2;
    drawPoint = renderer.anchor;
    drawPoint.y += renderer.fontSize;
    // draw
    for (let i = 0; i < lines.length; i++) {
        // context.fillText(lines[i], renderer.anchor.x, -renderer.anchor.y + lineHeight * i);
        context.fillText(lines[i], drawPoint.x, drawPoint.y + lineHeight * i);
    }
    // console.log(renderer.measuredTextWidth)
}
