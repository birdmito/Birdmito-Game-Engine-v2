import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Contact, b2ContactImpulse, b2ContactListener, b2Draw, b2Fixture, b2FixtureDef, b2Manifold, b2PointState, b2PolygonShape, b2Shape, b2Vec2, b2World } from "@flyover/box2d";
import { BoxCollider, CircleCollider } from "./behaviours/Collider";
import { RigidBody } from "./behaviours/RigidBody";
import { DebugDraw } from "./draw";
import { GameObject, getGameObjectById } from "./engine";
import { Behaviour } from "./engine/Behaviour";
import { System } from "./engine/systems/System";
import { Transform } from "./engine/Transform";

export class PhysicsSystem extends System {

    public m_world: b2World;


    private removeList: b2Body[] = [];
    constructor() {
        super();
        const gravity: b2Vec2 = new b2Vec2(0, -10);
        const world = new b2World(gravity);

        this.m_world = world;
    }

    SetContactListener(b2Listener: b2ContactListener) {
        this.m_world.SetContactListener(b2Listener);
    }

    setDebugDraw(debugDraw: b2Draw) {
        this.m_world.SetDebugDraw(debugDraw);
    }

    onAddComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof RigidBody) {
            const bodyDefine = new b2BodyDef();
            bodyDefine.fixedRotation = true;
            bodyDefine.position.Set(component.x / DebugDraw.EXTENT, component.y / DebugDraw.EXTENT);
            bodyDefine.type = component.type as any as b2BodyType;
            const rigidBody = this.m_world.CreateBody(bodyDefine);
            rigidBody.SetUserData(gameObject);
            component.b2RigidBody = rigidBody;
        }
        else if (component instanceof CircleCollider) {
            const shape = new b2CircleShape();
            shape.m_radius = component.radius / DebugDraw.EXTENT
            const fd = new b2FixtureDef();
            fd.shape = shape;
            fd.density = 20.0;
            fd.friction = 1.0;
            const rigidBodyComponent = gameObject.getBehaviour(RigidBody);
            const rigidBody = rigidBodyComponent.b2RigidBody;
            rigidBody.CreateFixture(fd);
            component.b2CircleShape = rigidBody.GetFixtureList().GetShape() as b2CircleShape;
        }
        else if (component instanceof BoxCollider) {
            const shape = new b2PolygonShape();
            shape.SetAsBox(component.width / 2 / DebugDraw.EXTENT, component.height / 2 / DebugDraw.EXTENT, new b2Vec2(0, 0), 0);
            const fd = new b2FixtureDef();
            fd.shape = shape;
            fd.density = 20.0;
            fd.friction = 1.0;
            const rigidBodyComponent = gameObject.getBehaviour(RigidBody);
            const rigidBody = rigidBodyComponent.b2RigidBody;
            rigidBody.CreateFixture(fd);
            component.b2PolygonShape = rigidBody.GetFixtureList().GetShape() as b2PolygonShape;
        }
    }

    onRemoveComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof RigidBody) {
            this.removeList.push(component.b2RigidBody)
        }
    }

    onTick() {
        for (let b2body = this.m_world.GetBodyList(); b2body; b2body = b2body.GetNext()) {
            const b2Transform = b2body.GetTransform();
            const gameObject = b2body.GetUserData() as GameObject;
            const transform = gameObject.getBehaviour(Transform)
            transform.x = b2Transform.p.x * DebugDraw.EXTENT
            transform.y = -b2Transform.p.y * DebugDraw.EXTENT
        }
    }

    onUpdate() {



        let timeStep = settings.m_hertz > 0 ? 1 / settings.m_hertz : 0;

        if (settings.m_pause) {
            if (settings.m_singleStep) {
                settings.m_singleStep = false;
            } else {
                timeStep = 0;
            }
        }

        this.m_world.SetAllowSleeping(settings.m_enableSleep);
        this.m_world.SetWarmStarting(settings.m_enableWarmStarting);
        this.m_world.SetContinuousPhysics(settings.m_enableContinuous);
        this.m_world.SetSubStepping(settings.m_enableSubStepping);
        const mode = this.gameEngine.mode;
        if (mode !== 'edit') {
            this.m_world.Step(timeStep, settings.m_velocityIterations, settings.m_positionIterations);
        }
        for (const body of this.removeList) {
            this.m_world.DestroyBody(body);
        }
        this.removeList = [];



    }

    onEnd() {
        console.log('游戏结束')
    }
}



export class Settings {
    public m_windowWidth: number = 1600;
    public m_windowHeight: number = 900;
    public m_hertz: number = 60;
    public m_velocityIterations: number = 8;
    public m_positionIterations: number = 3;
    // #if B2_ENABLE_PARTICLE
    // Particle iterations are needed for numerical stability in particle
    // simulations with small particles and relatively high gravity.
    // b2CalculateParticleIterations helps to determine the number.
    // #endif
    public m_drawShapes: boolean = true;
    // #endif
    public m_drawJoints: boolean = true;
    public m_drawControllers: boolean = true;
    public m_enableWarmStarting: boolean = true;
    public m_enableContinuous: boolean = true;
    public m_enableSubStepping: boolean = false;
    public m_enableSleep: boolean = true;
    public m_pause: boolean = false;
    public m_singleStep: boolean = false;
    // #if B2_ENABLE_PARTICLE
    public m_strictContacts: boolean = false;
    // #endif
}

const settings = new Settings()
export class ContactPoint {
    public fixtureA!: b2Fixture;
    public fixtureB!: b2Fixture;
    public readonly normal: b2Vec2 = new b2Vec2();
    public readonly position: b2Vec2 = new b2Vec2();
    public state: b2PointState = b2PointState.b2_nullState;
    public normalImpulse: number = 0;
    public tangentImpulse: number = 0;
    public separation: number = 0;
}


class MyContactListener extends b2ContactListener {

    BeginContact(contact: b2Contact<b2Shape, b2Shape>): void {
        const body = contact.GetFixtureB().GetBody();
        const mainRole = getGameObjectById('mainRole')
        if (body === mainRole.getBehaviour(RigidBody).b2RigidBody) {
            const mainRole = getGameObjectById('mainRole')
            mainRole.parent.removeChild(mainRole)
        }
    }

    EndContact(contact: b2Contact<b2Shape, b2Shape>): void {

    }

    PreSolve(contact: b2Contact<b2Shape, b2Shape>, oldManifold: b2Manifold): void {

    }

    PostSolve(contact: b2Contact<b2Shape, b2Shape>, impulse: b2ContactImpulse): void {

    }
}