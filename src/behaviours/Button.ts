import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";

export class Button extends Behaviour {
    state: 'idle' | 'hover' | 'pressed' | 'disabled';    // 按钮状态
    
    onClick() {
        this.gameObject.onClick  = () =>{
            this.gameObject.getBehaviour(TextRenderer).text = 'clicked';
        }
    }

    onStart(): void {
        this.onClick();
    }

    constructor() {
        super();
        this.state = 'idle';    // 初始状态
        //this.onClick = null;    // 点击事件
    }
    
    // 鼠标事件
    // --------------------
    onMouseEnter(){
        this.state = 'hover';
    }

    onMouseLeave(){
        this.state = 'idle';
    }

    onMouseDown(){
        this.state = 'pressed';
    }

    onMouseUp(){
        this.state = 'hover';
        if(this.onClick){
            this.onClick();
        }
    }

}