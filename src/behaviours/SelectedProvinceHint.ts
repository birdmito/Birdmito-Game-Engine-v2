import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";

export class SelectedProvinceHint extends Behaviour {
    imageSrc: string = './assets/images/TESTColor.png'
    noneSrc: string = './assets/images/TESTTransparent.png'
    onUpdate(): void {
        this.gameObject.onMouseEnter = () => {
            this.gameObject.getBehaviour(BitmapRenderer).source = this.imageSrc
        }
        this.gameObject.onMouseLeave = () => {
            this.gameObject.getBehaviour(BitmapRenderer).source = this.noneSrc
        }
    }
}
