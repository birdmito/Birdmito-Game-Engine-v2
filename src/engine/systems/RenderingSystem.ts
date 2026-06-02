import { Camera } from "../../behaviours/Camera";
import { HexagonLine } from "../../behaviours/HexagonLine";
import { Nation } from "../../behaviours/Nation";
import { ShapeRectRenderer } from "../../behaviours/unneed/ShapeRectRenderer";
import { GameObject, getGameObjectById, Renderer } from "../../engine";
import { AnimationRenderer } from "../AnimationRenderer";
import { Behaviour } from "../Behaviour";
import { BitmapRenderer } from "../BitmapRenderer";
import { HexagonBorderRenderer } from "../HexagonBorderRenderer";
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
        if (component instanceof TextRenderer) {

            component.measuredTextWidth = this.context.measureText(component.text).width;
            if (component.lineWidth === undefined) {
                component.lineWidth = String(component.measuredTextWidth);
            }
            if (component.lineHeight === undefined) {
                component.lineHeight = '1';
            }
            // component.setAnchor(component.anchorType);
        }
        if (
            component instanceof ShapeRectRenderer ||
            component instanceof TextRenderer ||
            component instanceof BitmapRenderer ||
            component instanceof AnimationRenderer ||
            component instanceof HexagonBorderRenderer
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

    _logRenderTimeStatistics = false;
    _timeRecord = 0;
    _frameCount = 0;
    _renderStats = new Map<string, { totalTime: number, count: number, minTime: number, maxTime: number }>();
    _statisticsFrames = 60; // 统计60帧的平均数据

    onStart(): void {
        window["logRenderTimeStatistics"] = (frames = 60) => {
            this._logRenderTimeStatistics = true;
            this._frameCount = 0;
            this._renderStats.clear();
            this._statisticsFrames = frames;
        }
    }

    onUpdate(): void {
        const context = this.context;

        const cameraGameObject =
            this.gameEngine.mode === "play" ? getGameObjectById("Camera") : this.gameEngine.editorGameObject;

        const camera = cameraGameObject.getBehaviour(Camera);
        const viewportMatrix = camera.calculateViewportMatrix();

        const self = this;
        const frameStartTime = performance.now();
        let renderCount = 0;

        function visitChildren(gameObject: GameObject) {
            for (const child of gameObject.children) {
                const itemStartTime = performance.now();

                if (child.renderer) {
                    if (child.active == false) {
                        continue;
                    }
                    renderCount++;

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

                        if (renderer.renderType === 'ui') {
                            const originalWidth = img.width;
                            const originalHeight = img.height;
                            const scaleX = renderer.scaleX;
                            const scaleY = renderer.scaleY;
                            const borderWidth = renderer.borderWidth;
                            const cellSize = Math.floor((Math.min(originalWidth, originalHeight) - (borderWidth * 2)));

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
                        else {
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
                    } else if (child.renderer instanceof HexagonBorderRenderer) {
                        const renderer = child.renderer as HexagonBorderRenderer;
                        context.save()
                        for (let i = 1; i <= Nation.nationQuantity; i++) {
                            drawHexagon(context, i);
                        }
                        context.restore();
                    }
                }

                // 记录统计数据
                if (self._logRenderTimeStatistics) {
                    const renderTime = performance.now() - itemStartTime;
                    const stats = self._renderStats.get(child.id) || {
                        totalTime: 0,
                        count: 0,
                        minTime: Infinity,
                        maxTime: 0
                    };
                    stats.totalTime += renderTime;
                    stats.count++;
                    stats.minTime = Math.min(stats.minTime, renderTime);
                    stats.maxTime = Math.max(stats.maxTime, renderTime);
                    self._renderStats.set(child.id, stats);
                }

                visitChildren(child);
            }
        }

        visitChildren(this.rootGameObject);

        // 统计完整帧数据
        if (self._logRenderTimeStatistics) {
            const totalFrameTime = performance.now() - frameStartTime;
            const frameStats = self._renderStats.get('__FRAME__') || {
                totalTime: 0,
                count: 0,
                minTime: Infinity,
                maxTime: 0
            };
            frameStats.totalTime += totalFrameTime;
            frameStats.count++;
            frameStats.minTime = Math.min(frameStats.minTime, totalFrameTime);
            frameStats.maxTime = Math.max(frameStats.maxTime, totalFrameTime);
            self._renderStats.set('__FRAME__', frameStats);

            self._frameCount++;

            // 达到统计帧数后输出报告
            if (self._frameCount >= self._statisticsFrames) {
                console.log(`\n========== 渲染性能统计报告 (${self._statisticsFrames} 帧平均) ==========`);

                // 按平均渲染时间排序
                const sortedStats = Array.from(self._renderStats.entries())
                    .filter(([id]) => id !== '__FRAME__')
                    .sort((a, b) => (b[1].totalTime / b[1].count) - (a[1].totalTime / a[1].count));

                console.log(`\n🎯 渲染对象统计 (共 ${renderCount} 个对象):`);
                console.log('对象ID'.padEnd(30) + '平均耗时'.padEnd(15) + '最小耗时'.padEnd(15) + '最大耗时'.padEnd(15) + '占比');
                console.log('-'.repeat(90));

                const frameTotal = self._renderStats.get('__FRAME__');
                const avgFrameTime = frameTotal.totalTime / frameTotal.count;

                // 只显示前20个最耗时的对象
                sortedStats.slice(0, 20).forEach(([id, stats]) => {
                    const avg = stats.totalTime / stats.count;
                    const percentage = ((avg / avgFrameTime) * 100).toFixed(2);
                    console.log(
                        id.padEnd(30) +
                        `${avg.toFixed(4)}ms`.padEnd(15) +
                        `${stats.minTime.toFixed(4)}ms`.padEnd(15) +
                        `${stats.maxTime.toFixed(4)}ms`.padEnd(15) +
                        `${percentage}%`
                    );
                });

                if (sortedStats.length > 20) {
                    console.log(`... 还有 ${sortedStats.length - 20} 个对象未显示`);
                }

                console.log('\n⏱️  总体性能:');
                console.log(`平均帧时间: ${avgFrameTime.toFixed(4)}ms`);
                console.log(`最小帧时间: ${frameTotal.minTime.toFixed(4)}ms`);
                console.log(`最大帧时间: ${frameTotal.maxTime.toFixed(4)}ms`);
                console.log(`平均帧率: ${(1000 / avgFrameTime).toFixed(2)} FPS`);
                console.log(`最高帧率: ${(1000 / frameTotal.minTime).toFixed(2)} FPS`);
                console.log(`最低帧率: ${(1000 / frameTotal.maxTime).toFixed(2)} FPS`);
                console.log('='.repeat(90) + '\n');

                // 重置统计
                self._logRenderTimeStatistics = false;
                self._frameCount = 0;
                self._renderStats.clear();
            }
        }
    }
}
function drawText(context: CanvasRenderingContext2D, renderer: TextRenderer) {
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
        if (words[i] === '|') {
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
        maxWidth = Math.max(maxWidth, context.measureText(currentLine).width)
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

function drawHexagon(context: CanvasRenderingContext2D, nationId: number) {
    //这一段相当于判定了一个六边形中的0-1，1-2，2-3，3-4，4-5的链接
    for (let i = 0; i < Nation.nations[nationId].vertices.length - 1; i++) {
        const vertex = Nation.nations[nationId].vertices[i]
        const vertex1 = Nation.nations[nationId].vertices[i + 1]
        let isDraw = !judgeVertex(vertex, Nation.nations[nationId].needJumpVertices)

        //我们需要跳过5-6的链接，所以需要判定5-6的链接
        if ((i + 1) % 6 == 0 && i != 0) {
            isDraw = false
        };


        if (isDraw) { drawOneLine(context, nationId, vertex, vertex1, Nation.nations[nationId].nationBorderColor) }





    }
    //判断画了多少个六边形
    let length = Nation.nations[nationId].vertices.length
    let number = Math.floor(length / 6)
    //nuber 即为需要判定多少0-5的链接
    //这一段相当于判定了0-5的链接
    for (let k = 1; k <= number; k++) {
        if (judgeVertex(Nation.nations[nationId].vertices[k * 6 - 1], Nation.nations[nationId].needJumpVertices)) {
            continue;
        } else {
            drawOneLine(context, nationId, Nation.nations[nationId].vertices[k * 6 - 1], Nation.nations[nationId].vertices[(k - 1) * 6], Nation.nations[nationId].nationBorderColor)
        }
    }


}

function judgeVertex(vertexNeedJudge: { x: number, y: number }, judgeVertex: { x: number, y: number }[]) {
    for (let i = 0; i < judgeVertex.length; i++) {
        if (vertexNeedJudge == judgeVertex[i]) {
            return true
        }
    }
    return false
}

function drawOneLine(context: CanvasRenderingContext2D, nationId: number, vertex1: { x: number, y: number }, vertex2: { x: number, y: number }, color: string) {
    // 计算线段的长度和角度
    var dx = vertex2.x - vertex1.x;
    var dy = vertex2.y - vertex1.y;
    var line_length = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);

    // 计算垂直线的中点
    var mid_x = (vertex1.x + vertex2.x) / 2;
    var mid_y = (vertex1.y + vertex2.y) / 2;

    // 计算垂直线的起点和终点
    var perpendicular_length = 5;
    var perpendicular_start_x = mid_x - perpendicular_length * Math.sin(angle);
    var perpendicular_start_y = mid_y + perpendicular_length * Math.cos(angle);
    var perpendicular_end_x = mid_x + perpendicular_length * Math.sin(angle);
    var perpendicular_end_y = mid_y - perpendicular_length * Math.cos(angle);


    // 创建渐变对象
    var gradient = context.createLinearGradient(perpendicular_start_x, perpendicular_start_y, perpendicular_end_x, perpendicular_end_y);

    // 添加渐变颜色停止点
    gradient.addColorStop(0, getTransparentColor(color, 0)); // 起始点颜色，完全不透明
    gradient.addColorStop(1, color); // 终点颜色，完全透明


    // 开始绘制线条
    context.beginPath();
    context.moveTo(perpendicular_start_x, perpendicular_start_y);
    context.lineTo(perpendicular_end_x, perpendicular_end_y);

    // 设置线条宽度和颜色
    context.lineWidth = line_length + 8;
    context.strokeStyle = gradient;

    // 绘制线条
    context.stroke();

}

function getTransparentColor(color, alpha) {
    // 将 RGB 格式的颜色字符串转换为 RGBA 格式，并设置透明度
    return color.replace('rgb', 'rgba').replace(')', ', ' + alpha + ')');
}
//     // 创建一个空的 Map 对象来保存边信息和重叠次数
//         const edgeMap = new Map();

//         // 计算六边形的顶点坐标
//         const vertices = [];
//         for (let i = 0; i < 6; i++) {
//         const angle = (Math.PI / 3) * i + Math.PI / 6;
//         const x = renderer.x + renderer.radius * Math.cos(angle);
//         const y = renderer.y + renderer.radius * Math.sin(angle);
//         vertices.push({ x, y });

//         // 存储边的信息到 Map 中，并初始化重叠次数为 0
//         const startVertexIndex = i;
//         let endVertexIndex = i + 1;
//         if (endVertexIndex === 6) {
//             endVertexIndex = 0; // 最后一条边连接回第一个顶点
//         }
//         const edgeKey = `Edge(${startVertexIndex}, ${endVertexIndex})`;
//         const edgeValue = { start: vertices[startVertexIndex], end: vertices[endVertexIndex], overlapCount: 0 };
//         edgeMap.set(edgeKey, edgeValue);
//         }

//         // 进行边的比较，记录重叠次数
//         edgeMap.forEach((edge1, key1) => {
//         edgeMap.forEach((edge2, key2) => {
//             if (key1 !== key2 && checkOverlap(edge1, edge2)) {
//             edge1.overlapCount++;
//             }
//         });
//         });

//         // 开始绘制六边形
//         context.beginPath();
//         for (let i = 0; i < 6; i++) {
//         const startVertex = vertices[i];
//         const endVertex = vertices[(i + 1) % 6];
//         const edgeKey = `Edge(${i}, ${(i + 1) % 6})`;
//         const edge = edgeMap.get(edgeKey);

//         if (edge.overlapCount === 1) {
//             context.moveTo(startVertex.x, startVertex.y);
//             context.lineTo(endVertex.x, endVertex.y);
//         }
//         }
//         context.closePath();

//         // 设置描边颜色和线宽
//         context.strokeStyle = renderer.color;
//         context.lineWidth = 3;

//         // 绘制描边
//         context.stroke();
// }

// function checkOverlap(edge1, edge2): boolean {
//     if(edge1 === edge2) {
//         return false;
//     }
//     return true;
//   }


