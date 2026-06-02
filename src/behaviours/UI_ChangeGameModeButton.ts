import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcessMgr } from "./GameProcessMgr";

export class UI_ChangeGameModeButton extends Behaviour {
    onStart(): void {
        this.gameObject.onMouseLeftDown = () => {
            if (GameProcessMgr.gameMode === 'hotSeat') {
                GameProcessMgr.gameMode = 'PVE'
                this.gameObject.getChildById("_GameModeText").getBehaviour(TextRenderer).text = "PVE"
            }
            else {
                GameProcessMgr.gameMode = 'hotSeat'
                this.gameObject.getChildById("_GameModeText").getBehaviour(TextRenderer).text = "热座"
            }
        }
    }
}