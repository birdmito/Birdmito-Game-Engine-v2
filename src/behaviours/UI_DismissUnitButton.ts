import { Behaviour } from "../engine/Behaviour";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { UnitBehaviour } from "./UnitBehaviour";

export class UI_DismissUnitButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            console.log("dismiss unit");
            const unit = SelectedObjectInfoMangaer.selectedBehaviour as UnitBehaviour;
            unit.dismiss();
        }
    }
}
