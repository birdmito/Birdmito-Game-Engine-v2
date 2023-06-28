import { b2Body } from "@flyover/box2d";
import { DebugDraw } from "../draw";
import { Behaviour } from "../engine/Behaviour";
import { number } from "../engine/validators/number";

export enum RigidBodyType {
    STATIC = 0,

    KINEMATIC = 1,

    DYNAMIC = 2,
}

export class RigidBody extends Behaviour {
    b2RigidBody: b2Body;

    private _x: number = 0;
    @number()
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
        if (this.b2RigidBody) {
            this.b2RigidBody.SetTransformXY(this._x / DebugDraw.EXTENT, -this._y / DebugDraw.EXTENT, 0);
        }
    }

    private _y: number = 0;
    @number()
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
        if (this.b2RigidBody) {
            this.b2RigidBody.SetTransformXY(this._x / DebugDraw.EXTENT, -this._y / DebugDraw.EXTENT, 0);
        }
    }

    @number({
        editorType: "select",
        options: [
            { value: RigidBodyType.STATIC, label: "静态刚体" },
            { value: RigidBodyType.KINEMATIC, label: "动力学刚体" },
            { value: RigidBodyType.DYNAMIC, label: "动态刚体" },
        ],
    })
    type: RigidBodyType = RigidBodyType.STATIC;

    allowSleep: boolean = false;
}
