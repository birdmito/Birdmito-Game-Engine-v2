import { GameEngine, GameObject } from "../engine";

export class Behaviour {
    gameObject: GameObject;

    get engine(): GameEngine {
        return this.gameObject.engine;
    }

    _active: boolean = false;

    get active() {
        return this._active;
    }

    set active(value: boolean) {
        if (value === this._active) {
            return;
        }
        this._active = value;
        const allSystems = this.engine.getSystems();
        for (const system of allSystems) {
            if (value) {
                system.onAddComponent(this.gameObject, this);
            } else {
                system.onRemoveComponent(this.gameObject, this);
            }
        }
    }

    destroy() {
        this.gameObject.removeBehaviour(this);
    }

    onStart() {}

    onTick(duringTime: number) {}

    onUpdate() {}

    onEnd() {}
}
