import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcess } from "./GameProcess";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { generateTip } from "./Tip";
import { UnitBehaviour } from "./UnitBehaviour";

export class UI_DeclareWarButton extends Behaviour {
    targetNation: Nation
    onStart(): void {
        const selectedObj = SelectedObjectInfoMangaer.selectedBehaviour as Province | UnitBehaviour
        this.targetNation = Nation.nations[selectedObj.nationId]
    }

    onUpdate(): void {
        if (Nation.nations[GameProcess.playerNationId].enemyNationList.includes(this.targetNation)) {
            getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).text = '议和'
            getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).color = '#00ff00'
        } else {
            getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).text = '宣战'
            getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).color = '#ff0000'
        }

        this.gameObject.onMouseLeftDown = () => {
            switch (getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).text) {
                case '议和':
                    Nation.nations[GameProcess.playerNationId].peace(this.targetNation)
                    console.log('我们和他们议和了')
                    generateTip(this, `我们和${this.targetNation.nationName}议和了`)
                    return
                case '宣战':
                    Nation.nations[GameProcess.playerNationId].declareWar(this.targetNation)
                    console.log('我们对他们宣战了')
                    generateTip(this, `我们对${this.targetNation.nationName}宣战了`)
                    return
            }
        }
    }
}
