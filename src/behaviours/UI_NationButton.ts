import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";

export class UI_NationButton extends Behaviour {
    nation;
    onStart(): void {
        const province = SelectedObjectInfoMangaer.selectedBehaviour as Province
        this.nation = Nation.nations[province.nationId]
    }
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            console.log("弹出国家窗口")
        }
    }
}
