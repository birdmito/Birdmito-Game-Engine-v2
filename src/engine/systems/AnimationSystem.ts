import { GameObject } from '../../engine'
import { AnimationRenderer } from '../AnimationRenderer'
import { Behaviour } from '../Behaviour'
import { System } from './System'
export class AnimationSystem extends System {

    animationRenderers: AnimationRenderer[] = [];

    onAddComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof AnimationRenderer) {
            this.animationRenderers.push(component)
        }
    }

    onRemoveComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof AnimationRenderer) {
            const index = this.animationRenderers.indexOf(component)
            if (index >= 0) {
                this.animationRenderers.splice(index, 1);
            }
        }
    }


    onTick(duringTime: number): void {

        for (const animation of this.animationRenderers) {
            animation.advancedTime += duringTime;
            const config = animation.getConfig();
            const currentActionName = animation.action;
            const currentActionConfig = config.actions[currentActionName]
            const actionKeyFrames = currentActionConfig.keyframes;
            let fps = currentActionConfig.fps || 10
            let framePerMilesecond = 1000 / fps;
            if (framePerMilesecond < 100) {
                framePerMilesecond = 100;
            }
            // if (this.gameEngine.mode === 'edit') {
            //     framePerMilesecond = Number.MAX_VALUE;
            // }
            while (animation.advancedTime > framePerMilesecond) {
                animation.advancedTime -= framePerMilesecond;
                animation.currentFrame++;
                if (animation.currentFrame > actionKeyFrames.length - 1) {
                    animation.currentFrame = 0;
                }
            }
            const currentKey = actionKeyFrames[animation.currentFrame]
            animation.sourceRect = config.spritesheet[currentKey]
        }
    }
}