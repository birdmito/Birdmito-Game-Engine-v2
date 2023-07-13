import { Behaviour } from "../engine/Behaviour";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { UnitBehaviour } from "./UnitBehaviour";

export class UI_SplitUnitButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            console.log("Split unit");
            const unit = SelectedObjectInfoMangaer.selectedBehaviour as UnitBehaviour;
            unit.split();
        }
    }
}
