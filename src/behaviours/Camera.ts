import { getGameObjectById, Matrix } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { invertMatrix, matrixAppendMatrix } from "../engine/math";
import { Transform } from "../engine/Transform";


export class Camera extends Behaviour {
    viewportWidth: number = 1920;
    viewportHeight: number = 1080;

    viewScale: number = 1;
    tx: number = 0;
    ty: number = 0;

    constructor() {
        super();
    }

    onStart(): void {
        console.log("camera start");
    }

    calculateViewportMatrix() {
        const cameraTransform = this.gameObject.getBehaviour(Transform);
        const offsetMatrix = new Matrix(this.viewScale, 0, 0, this.viewScale, this.tx, this.ty);
        let viewportMatrix = invertMatrix(matrixAppendMatrix(cameraTransform.globalMatrix, offsetMatrix));
        return viewportMatrix;
    }

}
