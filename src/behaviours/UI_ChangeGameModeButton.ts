import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcess } from "./GameProcess";

export class UI_ChangeGameModeButton extends Behaviour {
    onStart(): void {
        this.gameObject.onMouseLeftDown = () => {
            if (GameProcess.gameMode === 'hotSeat') {
                GameProcess.gameMode = 'PVE'
                this.gameObject.getChildById("_GameModeText").getBehaviour(TextRenderer).text = "PVE"
            }
            else {
                GameProcess.gameMode = 'hotSeat'
                this.gameObject.getChildById("_GameModeText").getBehaviour(TextRenderer).text = "热座"
            }
        }
    }
}