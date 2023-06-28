import { Renderer } from "../engine";
import { Behaviour } from "./Behaviour";
import { Rectangle } from "./math";
import { string } from "./validators/string";
import * as yaml from 'js-yaml';

export class AnimationRenderer extends Behaviour implements Renderer {
    @string()
    source = "";

    @string()
    config = ""

    @string()
    private _action = '';
    public get action() {
        return this._action;
    }
    public set action(value) {
        this._action = value;
        this.currentFrame = 0;
    }

    advancedTime: number = 0;

    currentFrame: number = 0;

    _configData: any;
    getConfig() {
        if (!this._configData) {
            const text = this.engine.resourceManager.getText(this.config)
            this._configData = yaml.load(text)
        }
        return this._configData;
    }

    sourceRect = { x: 0, y: 157, width: 100, height: 157 }

    getBounds(): Rectangle {
        const img = this.engine.resourceManager.getImage(this.source)
        return {
            x: 0,
            y: 0,
            width: 100,
            height: 157,
        };
    }
}
