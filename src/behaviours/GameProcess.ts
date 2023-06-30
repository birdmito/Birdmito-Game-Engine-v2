import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";

export class GameProcess extends Behaviour {
    turnrNow = 0;
    turnTotal = 2;

    onStart(): void {
        this.updateTurn();
    }

    onUpdate(): void {

    }

    updateTurn() {
        this.turnrNow += 1;
        getGameObjectById("TurnText").getBehaviour(TextRenderer).text =
            this.turnrNow.toString() + "/" + this.turnTotal.toString();
        if (this.turnrNow === this.turnTotal) {
            this.gameOver();
        }
    }

    gameOver() {
        console.log("game over");

    }
}
