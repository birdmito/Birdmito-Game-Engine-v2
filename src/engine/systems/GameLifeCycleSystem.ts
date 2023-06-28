import { GameObject } from "../../engine";
import { Behaviour } from "../Behaviour";
import { System } from "./System";
// 当前问题：
// 在运行时动态添加一个 ShapeRectRenderer，屏幕中没有显示红色方块
// 期待结果：
// 在动态添加一个 ShapeRectRenderer后，运行时区域应该显示一个红色方块
// 实际结果：
// 并没有显示
// 原因：
// 1. 之所以能显示红色方块，是因为 ShapeRectRenderer所在的GameObject.renderer 被设置为了 ShapeRectRenderer
// 2. 上述代码写在了 ShapeRectRenderer的onStart函数中
// 3. ShapeRectRenderer.onStart  会在 GameLifeCycleSystem.onStart 中执行
// 4. GameLifeCycleSystem.onStart 仅在运行时启动时执行
// 5. 因此，运行时启动之后，动态添加的 ShapeRectRenderer会因为没有调用到 onStart 从而无法渲染出红色方块

export class GameLifeCycleSystem extends System {

    onAddComponent(gameObject: GameObject, component: Behaviour): void {
        component.onStart();
    }

    onRemoveComponent(gameObject: GameObject, component: Behaviour): void {
        component.onEnd();
    }

    onTick(duringTime: number): void {
        function visit(gameObject: GameObject) {
            for (const behaviour of gameObject.behaviours) {
                behaviour.onTick(duringTime);
            }
            for (const child of gameObject.children) {
                visit(child);
            }
        }
        visit(this.rootGameObject)
    }

    onUpdate(): void {
        function visit(gameObject: GameObject) {
            for (const behaviour of gameObject.behaviours) {
                behaviour.onUpdate();
            }
            for (const child of gameObject.children) {
                visit(child);
            }
        }
        visit(this.rootGameObject)
    }
}