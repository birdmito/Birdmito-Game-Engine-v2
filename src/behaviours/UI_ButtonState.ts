import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
export class UI_ButtonState extends Behaviour{
    // OPTIMIZE 更好的按钮状态转换，以防止图片被替换为"_Active_Highlight.png"等问题
    originSource: string;
    onStart(): void {
        this.originSource = this.gameObject.getBehaviour(BitmapRenderer).source;
        console.log(this.originSource)
        // 将source的.png替换为_Active.png
        this.gameObject.onMouseLeftDownList.push(() => {
            const source = this.gameObject.getBehaviour(BitmapRenderer).source.replace('_Highlight.png', '_Active.png');
            if(!this.engine.resourceManager.imageCache[source]){
                this.gameObject.getBehaviour(BitmapRenderer).source = this.originSource;
                return;
            }
            this.gameObject.getBehaviour(BitmapRenderer).source = source;
        });
        this.gameObject.onMouseLeftUpList.push(() => {
            const source = this.gameObject.getBehaviour(BitmapRenderer).source.replace('_Active.png', '_Highlight.png');
            if(!this.engine.resourceManager.imageCache[source]){
                this.gameObject.getBehaviour(BitmapRenderer).source = this.originSource;
                return;
            }
            this.gameObject.getBehaviour(BitmapRenderer).source = source;
        });
        this.gameObject.onMouseEnterList.push(() => {
            const source = this.gameObject.getBehaviour(BitmapRenderer).source.replace('.png', '_Highlight.png');
            if(!this.engine.resourceManager.imageCache[source]){
                this.gameObject.getBehaviour(BitmapRenderer).source = this.originSource;
                return;
            }
            this.gameObject.getBehaviour(BitmapRenderer).source = source;
        });
        this.gameObject.onMouseLeaveList.push(() => {
            const source = this.gameObject.getBehaviour(BitmapRenderer).source.replace('_Highlight.png', '.png');
            if(!this.engine.resourceManager.imageCache[source]){
                this.gameObject.getBehaviour(BitmapRenderer).source = this.originSource;
                return;
            }
            this.gameObject.getBehaviour(BitmapRenderer).source = source;
        });
    }
}