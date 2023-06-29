import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { number } from "../engine/validators/number";

export class ProvinceBehaviour extends Behaviour {
    @number()
    nationId = 0;

    changeNationId(nationId: number) {
        this.nationId = nationId;
        this.gameObject.getBehaviour(TextRenderer).text = this.nationId.toString();
    }

    onStart(): void {
        console.log("province start");
        this.changeNationId(0);
    }

}
