import * as yaml from "js-yaml";
import { Binding } from "./bindings/Binding";
import { Behaviour } from "./engine/Behaviour";
import { ResourceManager } from "./engine/ResourceManager";
import { Transform } from "./engine/Transform";
import { Circle, Hexagon, Rectangle } from "./engine/math";
import { System } from "./engine/systems/System";
import { CanvasContextRenderingSystem } from "./engine/systems/RenderingSystem";
import { LayoutGroup } from "./behaviours/LayoutGroup";
import { AnchorSystem } from "./engine/systems/AnchorSystem";
import { AudioClip } from "./engine/AudioClip";

export const gameObjects: { [id: string]: GameObject } = {};

export class Matrix {
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    tx = 0;
    ty = 0;

    constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    updateFromTransformProperties(x: number, y: number, scaleX: number, scaleY: number, rotation: number) {
        this.tx = x;
        this.ty = y;

        let skewX, skewY;
        skewX = skewY = (rotation / 180) * Math.PI;

        this.a = Math.cos(skewY) * scaleX;
        this.b = Math.sin(skewY) * scaleX;
        this.c = -Math.sin(skewX) * scaleY;
        this.d = Math.cos(skewX) * scaleY;
    }
}

export class GameEngine {
    defaultSceneName: string = "";
    rootGameObject = new GameObject();
    editorGameObject = new GameObject();
    lastTime: number = 0;
    storeDuringTime: number = 0;
    deltaTime: number = 0;
    resourceManager = new ResourceManager();
    systems: System[] = [];

    public mode: "edit" | "preview" | "play" = "edit";

    // 系统性能统计
    private _logSystemPerformance = false;
    private _systemStatsFrameCount = 0;
    private _systemStatsTargetFrames = 60;
    private _systemStats = new Map<string, {
        tickTime: { total: number, count: number, min: number, max: number },
        updateTime: { total: number, count: number, min: number, max: number },
        lateUpdateTime: { total: number, count: number, min: number, max: number }
    }>();
    private _autoDownloadReport = false; // 是否自动下载报告

    constructor(mode: string) {
        if (mode !== "edit" && mode !== "preview" && mode !== "play") {
            alert('mode must be "edit" or "preview" or "play"');
            return;
        } else {
            this.mode = mode;
        }
        this.rootGameObject.engine = this;
        this.editorGameObject.engine = this;
        this.rootGameObject.active = true;
        this.rootGameObject.addBehaviour(new Transform());
        this.editorGameObject.addBehaviour(new Transform());

        // 注册全局性能统计函数
        window["logSystemPerformance"] = (frames = 60, autoDownload = false) => {
            this._logSystemPerformance = true;
            this._systemStatsFrameCount = 0;
            this._systemStatsTargetFrames = frames;
            this._autoDownloadReport = autoDownload;
            this._systemStats.clear();
            console.log(`🔍 开始统计系统性能 (${frames} 帧)...`);
            if (autoDownload) {
                console.log(`📥 统计完成后将自动下载报告`);
            }
        };
    }

    async loadAssets() {
        const assetsYaml = "./assets/assets.yaml";
        await this.resourceManager.loadText(assetsYaml);
        const assetsData = this.unserilizeAssetsYaml(assetsYaml);
        // image
        const imageList = assetsData.images;
        for (const asset of imageList) {
            await this.resourceManager.loadImage(asset);
        }
        // audio
        const audioList = assetsData.audios;
        for (const asset of audioList) {
            await this.resourceManager.loadAudio(asset);
        }
        // text
        const textList = assetsData.texts;
        for (const prefab of textList) {
            await this.resourceManager.loadText(prefab);
        }
    }

    unserilizeAssetsYaml(yamlUrl: string) {
        const text = this.resourceManager.getText(yamlUrl);
        try {
            let data = yaml.load(text);
            return data;
        } catch (e) {
            console.log(e);
            alert("资源清单文件解析失败");
        }
        return null;
    }

    addSystem(system: System) {
        this.systems.push(system);
        system.rootGameObject = this.rootGameObject;
        system.gameEngine = this;
    }

    removeSystem(system: System) {
        const index = this.systems.indexOf(system);
        if (index >= 0) {
            this.systems.splice(index);
        }
    }

    getSystems() {
        return this.systems;
    }

    getSystem<T extends typeof System>(clz: T): InstanceType<T> {
        for (const system of this.systems) {
            if (system.constructor.name === clz.name) {
                return system as any;
            }
        }
        return null;
    }

    start() {
        for (const system of this.systems) {
            system.onStart();
        }
        this.enterFrame(0);
    }

    changeScene(sceneName: string) {
        const currentScene = this.rootGameObject.children[0];
        if (currentScene) {
            this.rootGameObject.removeChild(currentScene);
        }
        const text = this.resourceManager.getText(sceneName);
        const scene = this.unserilize(text);
        if (scene) {
            this.rootGameObject.addChild(scene);
        }
    }

    createPrefab2(url: string, data?: BehaviourData) {
        const text = this.resourceManager.getText(url);
        const prefabGameObject = this.unserilize(text);
        if (data) {
            const prefabBehaviour = createBehaviour(data);
            prefabGameObject.addBehaviour(prefabBehaviour);
            prefabGameObject.prefabData = prefabBehaviour;
        }
        return prefabGameObject;
    }

    createPrefab<T extends Binding>(prefabBinding: T): GameObject {
        const url = getPrefabBehaviourInfo(prefabBinding.constructor.name);
        const text = this.resourceManager.getText(url);
        const prefabGameObject = this.unserilize(text);
        prefabGameObject.addBehaviour(prefabBinding);
        prefabGameObject.prefabData = prefabBinding;

        this.getSystem(AnchorSystem).calculateContainerBound(prefabGameObject);

        return prefabGameObject;
    }


    createPrefab2Children<T extends Binding>(prefabBinding: T, parent: GameObject): void {
        const prefab = this.createPrefab(prefabBinding);
        parent.addChild(prefab);
    }

    private unserilize(text: string): GameObject {
        let data: any;
        try {
            data = yaml.load(text);
        } catch (e) {
            console.log(e);
            alert("配置文件解析失败");
        }
        if (!data) {
            return null;
        } else {
            return createGameObject(data, this);
        }
    }

    serilize(gameObject: GameObject): string {
        const json = extractGameObject(gameObject);
        const text = yaml.dump(json, {
            noCompatMode: true,
        });
        console.log(text);
        return text;
    }

    private recordSystemTime(systemName: string, phase: 'tick' | 'update' | 'lateUpdate', time: number) {
        if (!this._logSystemPerformance) return;

        let stats = this._systemStats.get(systemName);
        if (!stats) {
            stats = {
                tickTime: { total: 0, count: 0, min: Infinity, max: 0 },
                updateTime: { total: 0, count: 0, min: Infinity, max: 0 },
                lateUpdateTime: { total: 0, count: 0, min: Infinity, max: 0 }
            };
            this._systemStats.set(systemName, stats);
        }

        const phaseKey = phase === 'tick' ? 'tickTime' : phase === 'update' ? 'updateTime' : 'lateUpdateTime';
        stats[phaseKey].total += time;
        stats[phaseKey].count++;
        stats[phaseKey].min = Math.min(stats[phaseKey].min, time);
        stats[phaseKey].max = Math.max(stats[phaseKey].max, time);
    }

    private generateReportText(): string {
        let report = '';

        report += '='.repeat(100) + '\n';
        report += `📊 系统性能统计报告 (${this._systemStatsTargetFrames} 帧平均)\n`;
        report += `生成时间: ${new Date().toLocaleString('zh-CN')}\n`;
        report += '='.repeat(100) + '\n\n';

        // 计算总时间
        let totalTickTime = 0;
        let totalUpdateTime = 0;
        let totalLateUpdateTime = 0;

        this._systemStats.forEach((stats) => {
            const avgTick = stats.tickTime.count > 0 ? stats.tickTime.total / stats.tickTime.count : 0;
            const avgUpdate = stats.updateTime.count > 0 ? stats.updateTime.total / stats.updateTime.count : 0;
            const avgLateUpdate = stats.lateUpdateTime.count > 0 ? stats.lateUpdateTime.total / stats.lateUpdateTime.count : 0;
            totalTickTime += avgTick;
            totalUpdateTime += avgUpdate;
            totalLateUpdateTime += avgLateUpdate;
        });

        const totalFrameTime = totalTickTime + totalUpdateTime + totalLateUpdateTime;

        // 打印表头
        report += '系统名称'.padEnd(30) + 'Tick(ms)'.padEnd(15) + 'Update(ms)'.padEnd(15) + 'LateUpdate(ms)'.padEnd(15) + '总计(ms)'.padEnd(15) + '占比\n';
        report += '-'.repeat(100) + '\n';

        // 按总耗时排序
        const sortedStats = Array.from(this._systemStats.entries())
            .map(([name, stats]) => {
                const avgTick = stats.tickTime.count > 0 ? stats.tickTime.total / stats.tickTime.count : 0;
                const avgUpdate = stats.updateTime.count > 0 ? stats.updateTime.total / stats.updateTime.count : 0;
                const avgLateUpdate = stats.lateUpdateTime.count > 0 ? stats.lateUpdateTime.total / stats.lateUpdateTime.count : 0;
                const total = avgTick + avgUpdate + avgLateUpdate;
                return { name, stats, avgTick, avgUpdate, avgLateUpdate, total };
            })
            .sort((a, b) => b.total - a.total);

        // 打印每个系统的统计
        sortedStats.forEach(({ name, stats, avgTick, avgUpdate, avgLateUpdate, total }) => {
            const percentage = ((total / totalFrameTime) * 100).toFixed(2);
            report += name.padEnd(30) +
                (avgTick > 0 ? avgTick.toFixed(4) : '-').padEnd(15) +
                (avgUpdate > 0 ? avgUpdate.toFixed(4) : '-').padEnd(15) +
                (avgLateUpdate > 0 ? avgLateUpdate.toFixed(4) : '-').padEnd(15) +
                total.toFixed(4).padEnd(15) +
                `${percentage}%\n`;
        });

        report += '-'.repeat(100) + '\n\n';

        // 打印详细信息
        report += '📈 详细性能信息:\n\n';
        sortedStats.forEach(({ name, stats, avgTick, avgUpdate, avgLateUpdate }) => {
            report += `🔹 ${name}:\n`;

            if (stats.tickTime.count > 0) {
                report += `  ⏱️  Tick: 平均 ${avgTick.toFixed(4)}ms | 最小 ${stats.tickTime.min.toFixed(4)}ms | 最大 ${stats.tickTime.max.toFixed(4)}ms\n`;
            }

            if (stats.updateTime.count > 0) {
                report += `  🔄 Update: 平均 ${avgUpdate.toFixed(4)}ms | 最小 ${stats.updateTime.min.toFixed(4)}ms | 最大 ${stats.updateTime.max.toFixed(4)}ms\n`;
            }

            if (stats.lateUpdateTime.count > 0) {
                report += `  🔚 LateUpdate: 平均 ${avgLateUpdate.toFixed(4)}ms | 最小 ${stats.lateUpdateTime.min.toFixed(4)}ms | 最大 ${stats.lateUpdateTime.max.toFixed(4)}ms\n`;
            }

            report += '\n';
        });

        // 打印总体性能
        report += '⏱️  总体帧性能:\n';
        report += `平均 Tick 总耗时: ${totalTickTime.toFixed(4)}ms\n`;
        report += `平均 Update 总耗时: ${totalUpdateTime.toFixed(4)}ms\n`;
        report += `平均 LateUpdate 总耗时: ${totalLateUpdateTime.toFixed(4)}ms\n`;
        report += `平均帧总耗时: ${totalFrameTime.toFixed(4)}ms\n\n`;

        const targetFrameTime = 16.67; // 60fps
        report += '📊 性能占用率分析 (目标 60fps = 16.67ms/帧):\n';
        report += `系统总占用: ${((totalFrameTime / targetFrameTime) * 100).toFixed(2)}%\n`;
        report += `性能评级: ${this.getPerformanceGrade(totalFrameTime)}\n\n`;

        report += '💡 提示:\n';
        report += '  - Tick: 固定时间步长的逻辑更新 (物理、游戏逻辑等)\n';
        report += '  - Update: 每帧执行的更新 (渲染、UI等)\n';
        report += '  - LateUpdate: 帧末尾执行的更新 (摄像机跟随等)\n';
        report += '  - 此统计不包括浏览器的帧同步等待时间\n\n';

        report += '='.repeat(100) + '\n';

        return report;
    }

    private downloadReport(reportText: string) {
        // 创建 Blob 对象
        const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 生成文件名（包含时间戳）
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `performance-report-${timestamp}.txt`;

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`📥 性能报告已下载: ${link.download}`);
    }

    private printSystemPerformanceReport() {
        const reportText = this.generateReportText();

        // 打印到控制台
        console.log('\n' + reportText);

        // 如果启用自动下载，则下载报告
        if (this._autoDownloadReport) {
            this.downloadReport(reportText);
        } else {
            // 提供手动下载选项
            console.log('💾 如需下载报告，请在控制台执行: downloadPerformanceReport()');
            window["downloadPerformanceReport"] = () => {
                this.downloadReport(reportText);
            };
        }
    }
    private getPerformanceGrade(frameTime: number): string {
        const usage = (frameTime / 16.67) * 100;
        if (usage < 30) return '🟢 优秀 (有大量性能余量)';
        if (usage < 50) return '🟡 良好 (性能充足)';
        if (usage < 70) return '🟠 一般 (接近性能瓶颈)';
        if (usage < 90) return '🔴 较差 (可能影响帧率)';
        return '🔴 严重 (严重影响帧率)';
    }

    enterFrame(advancedTime: number) {
        let duringTime = advancedTime - this.lastTime + this.storeDuringTime;
        const milesecondPerFrame = 1000 / 60;

        while (duringTime > milesecondPerFrame) {
            for (const system of this.systems) {
                const startTime = performance.now();
                system.onTick(milesecondPerFrame);
                const tickTime = performance.now() - startTime;
                this.recordSystemTime(system.constructor.name, 'tick', tickTime);
            }
            duringTime -= milesecondPerFrame;
        }

        this.storeDuringTime = duringTime;
        this.deltaTime = advancedTime - this.lastTime;

        const canvas = document.getElementById("game") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const system of this.systems) {
            const startTime = performance.now();
            system.onUpdate();
            const updateTime = performance.now() - startTime;
            this.recordSystemTime(system.constructor.name, 'update', updateTime);
        }

        for (const system of this.systems) {
            const startTime = performance.now();
            system.onLaterUpdate();
            const lateUpdateTime = performance.now() - startTime;
            this.recordSystemTime(system.constructor.name, 'lateUpdate', lateUpdateTime);
        }

        this.lastTime = advancedTime;

        // 检查是否需要输出统计报告
        if (this._logSystemPerformance) {
            this._systemStatsFrameCount++;
            if (this._systemStatsFrameCount >= this._systemStatsTargetFrames) {
                this.printSystemPerformanceReport();
                this._logSystemPerformance = false;
                this._systemStatsFrameCount = 0;
                this._systemStats.clear();
            }
        }
    }
}

export interface Renderer {
    hitAreaType;
    setAnchor(anchorType): void;
    getBounds(): Rectangle | Hexagon | Circle;
}

export interface GameEngineMouseEvent {
    localX: number;
    localY: number;
    globalX: number;
    globalY: number;
}

export class GameObject {
    static CURRENT_UUID = 0;

    static map: { [uuid: number]: GameObject } = {};

    prefabData: Behaviour | null = null;

    uuid: number = 0;
    id: string;
    parent: GameObject;

    // input event
    // ------------------------------
    stopPropagation: boolean = false; // 是否停止事件冒泡
    //#region 鼠标回调函数
    /**
     * @deprecated onClick函数为过时函数，不建议继续使用。
     * 请使用onMouseLeftDown、onMouseRightDown、onMouseMiddleDown替代。
     */
    onClick?: (event: GameEngineMouseEvent) => void;
    /**
     * @deprecated onMouseLeftDown函数为过时函数，不建议继续使用。  
     * 现在GameObject支持onMouseLeftDownList数组，可以添加多个回调函数。  
     * List使用方法：onMouseLeftDownList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseLeftDown?: (event: GameEngineMouseEvent) => void;
    /**
     * @deprecated onMouseMiddleDown函数为过时函数，不建议继续使用。
     * 现在GameObject支持onMouseMiddleDownList数组，可以添加多个回调函数。
     * List使用方法：onMouseMiddleDownList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseMiddleDown?: (event: GameEngineMouseEvent) => void;
    /**
     * @deprecated onMouseRightDown函数为过时函数，不建议继续使用。
     * 现在GameObject支持onMouseRightDownList数组，可以添加多个回调函数。
     * List使用方法：onMouseRightDownList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseRightDown?: (event: GameEngineMouseEvent) => void;
    /**
     * @deprecated onMouseLeftUp函数为过时函数，不建议继续使用。
     * 现在GameObject支持onMouseLeftUpList数组，可以添加多个回调函数。
     * List使用方法：onMouseLeftUpList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseLeftUp?: (event: GameEngineMouseEvent) => void;
    /**
     * @deprecated onMouseMiddleUp函数为过时函数，不建议继续使用。
     * 现在GameObject支持onMouseMiddleUpList数组，可以添加多个回调函数。
     * List使用方法：onMouseMiddleUpList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseMiddleUp?: (event: GameEngineMouseEvent) => void;
    /**
     * @deprecated onMouseRightUp函数为过时函数，不建议继续使用。
     * 现在GameObject支持onMouseRightUpList数组，可以添加多个回调函数。
     * List使用方法：onMouseRightUpList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseRightUp?: (event: GameEngineMouseEvent) => void;
    /**
     * @deprecated onMouseEnter函数为过时函数，不建议继续使用。
     * 现在GameObject支持onMouseEnterList数组，可以添加多个回调函数。
     * List使用方法：onMouseEnterList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseEnter?: (event: GameEngineMouseEvent) => void;
    /**
     * @deprecated onMouseLeave函数为过时函数，不建议继续使用。
     * 现在GameObject支持onMouseLeaveList数组，可以添加多个回调函数。
     * List使用方法：onMouseLeaveList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseLeave?: (event: GameEngineMouseEvent) => void;
    /**
     * @deprecated onMouseHover函数为过时函数，不建议继续使用。
     * 现在GameObject支持onMouseHoverList数组，可以添加多个回调函数。
     * List使用方法：onMouseHoverList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseHover?: (event: GameEngineMouseEvent) => void;

    /**
     * @description 当鼠标左键按下时，会触发该数组中的所有回调函数。  
     * List使用方法：onMouseLeftDownList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseLeftDownList: ((event: GameEngineMouseEvent) => void)[] = [];
    /**
     * @description 当鼠标中键按下时，会触发该数组中的所有回调函数。  
     * List使用方法：onMouseMiddleDownList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseMiddleDownList: ((event: GameEngineMouseEvent) => void)[] = [];
    /**
     * @description 当鼠标右键按下时，会触发该数组中的所有回调函数。  
     * List使用方法：onMouseRightDownList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseRightDownList: ((event: GameEngineMouseEvent) => void)[] = [];
    /**
     * @description 当鼠标左键抬起时，会触发该数组中的所有回调函数。  
     * List使用方法：onMouseLeftUpList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseLeftUpList: ((event: GameEngineMouseEvent) => void)[] = [];
    /**
     * @description 当鼠标中键抬起时，会触发该数组中的所有回调函数。
     * List使用方法：onMouseMiddleUpList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseMiddleUpList: ((event: GameEngineMouseEvent) => void)[] = [];
    /**
     * @description 当鼠标右键抬起时，会触发该数组中的所有回调函数。
     * List使用方法：onMouseRightUpList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseRightUpList: ((event: GameEngineMouseEvent) => void)[] = [];
    /**
     * @description 当鼠标进入时，会触发该数组中的所有回调函数。
     * List使用方法：onMouseEnterList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseEnterList: ((event: GameEngineMouseEvent) => void)[] = [];
    /**
     * @description 当鼠标离开时，会触发该数组中的所有回调函数。
     * List使用方法：onMouseLeaveList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseLeaveList: ((event: GameEngineMouseEvent) => void)[] = [];
    /**
     * @description 当鼠标悬停时，会触发该数组中的所有回调函数。
     * List使用方法：onMouseHoverList.push(someFunction);
     * @argument 注意：如果需要在onUpdate中调用，请暂时不要使用List。
     */
    onMouseHoverList: ((event: GameEngineMouseEvent) => void)[] = [];
    //#endregion

    behaviours: Behaviour[] = [];

    renderer: Renderer;

    children: GameObject[] = [];

    _active: boolean = false;
    engine: GameEngine;
    gameObject: any;

    get active() {
        return this._active;
    }

    set active(value: boolean) {
        // console.log('active' + this.id + ' ' + value);
        this._active = value;
        for (const behaviour of this.behaviours) {
            behaviour.active = value;
        }
        for (const child of this.children) {
            child.active = value;
        }
    }

    constructor() {
        this.uuid = GameObject.CURRENT_UUID++;
        GameObject.map[this.uuid] = this;
    }

    addChild(child: GameObject) {
        this.children.push(child);
        child.engine = this.engine;
        child.parent = this;
        if (this.active) {  //OPTIMIZE
            child.active = true;
        }
    }

    removeChild(child: GameObject) {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
        child.active = false;
    }

    changeParent(newParent: GameObject) {
        const index = this.parent.children.indexOf(this);
        if (index >= 0) {
            this.parent.children.splice(index, 1);
        }
        this.parent = newParent;
        newParent.children.push(this);
    }

    getChildById(id: string): GameObject {
        for (const child of this.children) {
            if (child.id === id) {
                return child;
            }
        }
        console.warn(`找不到id为${id}的子对象`);
        return null;
    }

    addBehaviour(behaviour: Behaviour) {
        this.behaviours.push(behaviour);
        behaviour.gameObject = this;
        if (this.active) {
            behaviour.active = true;
        }
    }

    //泛型
    getBehaviour<T extends typeof Behaviour>(clz: T): InstanceType<T> {
        for (const behaviour of this.behaviours) {
            if (behaviour.constructor.name === clz.name) {
                return behaviour as any;
            }
        }
        return null;
    }
    getBehaviours<T extends typeof Behaviour>(clz: T): InstanceType<T>[] {
        let behaviours: InstanceType<T>[] = [];
        for (const behaviour of this.behaviours) {
            if (behaviour.constructor.name === clz.name) {
                behaviours.push(behaviour as any);
            }
        }
        return behaviours;
    }
    // return [key:audioClip.name, value:audioClip]
    getAudioClips(): { [key: string]: AudioClip } {
        let audioClips: { [key: string]: AudioClip } = {};
        for (const behaviour of this.behaviours) {
            if (behaviour instanceof AudioClip) {
                audioClips[behaviour.name] = behaviour;
            }
        }
        return audioClips;
    }

    removeBehaviour(behaviour: Behaviour) {
        const index = this.behaviours.indexOf(behaviour);
        if (index >= 0) {
            this.behaviours.splice(index, 1);
            behaviour.active = false;
        }
    }

    destroy() {
        // for (const behaviour of this.behaviours) {
        //     behaviour.destroy();
        // }
        // for (const child of this.children) {
        //     child.destroy();
        // }
        this.parent.removeChild(this);
        // delete GameObject.map[this.uuid];
    }
}

const behaviourTable = {};

const prefabBehaviourTable = {};

export function getAllComponentDefinationNames() {
    return Object.keys(behaviourTable);
}

export function getBehaviourClassByName(name: string) {
    return behaviourTable[name];
}

type GameObjectData = {
    id?: string;
    // active?: boolean;   //OPTIMIZE
    behaviours: BehaviourData[];
    children?: GameObjectData[];
    prefab?: BehaviourData;
};

type BehaviourData = {
    type: string;
    properties?: { [index: string]: any };
};

export function registerBehaviourClass(behaviourClass: any) {
    const className = behaviourClass.name;
    behaviourTable[className] = behaviourClass;
    if (behaviourClass.__prefabUrl) {
        prefabBehaviourTable[className] = behaviourClass.__prefabUrl;
    }
}

function getPrefabBehaviourInfo(className: string): string {
    const url = prefabBehaviourTable[className];
    if (!url) {
        alert("未找到PrefabBehaviour" + className);
    }
    return url;
}

function extractBehaviour(behaviour: Behaviour): BehaviourData {
    const behaviourClass = (behaviour as any).__proto__;
    const behaviourClassName = (behaviour as any).constructor.name;
    const __metadatas = behaviourClass.__metadatas || [];
    const behaviourData: BehaviourData = { type: behaviourClassName };

    for (const metadata of __metadatas) {
        behaviourData.properties = behaviourData.properties || {};
        behaviourData.properties[metadata.key] = behaviour[metadata.key];
    }
    return behaviourData;
}

export function extractGameObject(gameObject: GameObject): GameObjectData {
    const gameObjectData: GameObjectData = {
        id: "",
        // active: true,  //OPTIMIZE
        behaviours: [],
        children: []
    };
    if (gameObject.id) {
        gameObjectData.id = gameObject.id;
    }

    // gameObjectData.active = gameObject.active   //OPTIMIZE

    if (gameObject.prefabData) {
        gameObjectData.prefab = extractBehaviour(gameObject.prefabData);
        return gameObjectData;
    }

    for (const behaviour of gameObject.behaviours) {
        const behaviourData = extractBehaviour(behaviour);
        gameObjectData.behaviours.push(behaviourData);
    }
    for (const child of gameObject.children) {
        const childData = extractGameObject(child);
        gameObjectData.children = gameObjectData.children || [];
        gameObjectData.children.push(childData);
    }
    return gameObjectData;
}

function createGameObject(data: GameObjectData, gameEngine: GameEngine): GameObject {
    let gameObject: GameObject;
    if (data.prefab) {
        const url = getPrefabBehaviourInfo(data.prefab.type);
        gameObject = gameEngine.createPrefab2(url, data.prefab);
    } else {
        gameObject = new GameObject();
        gameObject.engine = gameEngine;
    }
    if (data.id) {
        // console.log("使用了id:", data.id);
        gameObjects[data.id] = gameObject;
        gameObject.id = data.id;
    }
    else {
        // 如果没有id，就使用GameObject_uuid的形式
        data.id = `GameObject_${gameObject.uuid}`;
        gameObjects[data.id] = gameObject;
        gameObject.id = data.id;
        // console.log("生成了id:", gameObject.id);
    }

    if (data.prefab) {
        // if(data.active == undefined){
        //     gameObject.active = true;
        // }
        // else{
        //     gameObject.active = data.active;  //OPTIMIZE
        // }

        return gameObject;
    }
    for (const behaviourData of data.behaviours) {
        const behaviour = createBehaviour(behaviourData);
        gameObject.addBehaviour(behaviour);
    }

    if (data.children) {
        for (const childData of data.children) {
            const child = createGameObject(childData, gameEngine);
            gameObject.addChild(child);
        }
    }

    return gameObject;
}

function createBehaviour(behaviourData: BehaviourData) {
    const behaviourClass = behaviourTable[behaviourData.type];
    if (!behaviourClass) {
        throw new Error("传入的类名不对:" + behaviourData.type);
    }
    const behaviour: Behaviour = new behaviourClass();
    const __metadatas = behaviourClass.prototype.__metadatas || [];
    // 【反序列化】哪些属性，是根据 metadata(decorator) 来决定的
    // 既然如此，【序列化】哪些属性，也应该根据同样的 metadata(decorator) 来确定
    for (const metadata of __metadatas) {
        const key = metadata.key;
        const value = behaviourData.properties[key];
        metadata.validator(value);
        behaviour[key] = value;
    }
    return behaviour;
}

export function getGameObjectById(id: string) {
    return gameObjects[id];
}
