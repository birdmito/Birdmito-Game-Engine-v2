import { GameObject } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";

export class UI_NextTurnButtonRotate extends Behaviour {
    private static isFirstCall = true;
    private static initialRotation = 15;


    static async rotate(rotateObject: GameObject, rotateAngle: number, rotateTime: number): Promise<void> {
        const rotateSpeed = rotateAngle / rotateTime;
        const rotateInterval = 10;
        let i = 0;
        
        if (this.isFirstCall) {
            rotateObject.getBehaviour(Transform).rotation = this.initialRotation;
            this.isFirstCall = false;
            return;
        }

        const rotatePromise = new Promise<void>((resolve) => {
          const rotationInterval = setInterval(() => {
            if (i < rotateTime) {
              rotateObject.getBehaviour(Transform).rotation += rotateSpeed;
              i++;
            } else {
              clearInterval(rotationInterval);
              resolve();
            }
          }, rotateInterval);
        });
      
        await rotatePromise;
        rotateObject.getBehaviour(Transform).rotation = rotateObject.getBehaviour(Transform).rotation % 360;
      
      }

}
