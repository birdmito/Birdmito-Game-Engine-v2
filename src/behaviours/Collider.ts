import { b2CircleShape, b2PolygonShape, b2Vec2 } from "@flyover/box2d";
import { DebugDraw } from "../draw";
import { Behaviour } from "../engine/Behaviour";
import { number } from "../engine/validators/number";

export class CircleCollider extends Behaviour {
    b2CircleShape: b2CircleShape;

    private _radius = 1;
    @number({ allowZero: false })
    public get radius() {
        return this._radius;
    }
    public set radius(value) {
        this._radius = value;
        if (this.b2CircleShape) {
            this.b2CircleShape.m_radius = this._radius / DebugDraw.EXTENT;
        }
    }
}

export class EdgeCollider extends Behaviour {
    @number()
    startX: number;
    @number()
    endX: number;
    @number()
    startY: number;
    @number()
    endY: number;
}

export class BoxCollider extends Behaviour {
    b2PolygonShape: b2PolygonShape;

    private _width: number = 1;
    @number({ allowZero: false })
    public get width(): number {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;
        this.update();
    }

    private _height: number = 1;
    @number({ allowZero: false })
    public get height(): number {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
        this.update();
    }

    private update() {
        if (this.b2PolygonShape) {
            this.b2PolygonShape.SetAsBox(
                this._width / 2 / DebugDraw.EXTENT,
                this._height / 2 / DebugDraw.EXTENT,
                new b2Vec2(0, 0),
                0
            );
        }
    }
}
