import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
export class UI_ButtonState extends Behaviour{
    onStart(): void {
        // 将source的.png替换为_Active.png
        this.gameObject.onMouseLeftDown = () => {
            const source = this.gameObject.getBehaviour(BitmapRenderer).source.replace('_Highlight.png', '_Active.png');
            this.gameObject.getBehaviour(BitmapRenderer).source = source;
        }
        this.gameObject.onMouseLeftUp = () => {
            const source = this.gameObject.getBehaviour(BitmapRenderer).source.replace('_Active.png', '.png');
            this.gameObject.getBehaviour(BitmapRenderer).source = source;
        }
        this.gameObject.onMouseEnter = () => {
            const source = this.gameObject.getBehaviour(BitmapRenderer).source.replace('.png', '_Highlight.png');
            this.gameObject.getBehaviour(BitmapRenderer).source = source;
        }
        this.gameObject.onMouseLeave = () => {
            const source = this.gameObject.getBehaviour(BitmapRenderer).source.replace('_Highlight.png', '.png');
            this.gameObject.getBehaviour(BitmapRenderer).source = source;
        }
    }
}