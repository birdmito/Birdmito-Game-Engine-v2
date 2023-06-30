import { n } from "vitest/dist/types-2b1c412e";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { TextRenderer } from "../engine/TextRenderer";

export class RoundDisplayBehaviour extends Behaviour {

    roundTip:string = ' '
    roundNum:number = 0
    roundTotalNum:number = 10

    onStart(): void {
        this.changeRoundTip()
    }

    onUpdate(): void {

        this.gameObject.onClick = () => {
            console.log('change roundtip is clicked')
            // this.changeRoundTip(this.roundNUm,this.roundTotalNum)
        }
        
        this.gameObject.getBehaviour(TextRenderer).text = this.roundTip
    }

    changeRoundTip(){

        
        console.log('回合跳转')

        this.roundNum += 1 

        this.roundTip = '当前回合数: ' + this.roundNum.toString() + ' 总回合数：' + this.roundTotalNum.toString()


    }
}