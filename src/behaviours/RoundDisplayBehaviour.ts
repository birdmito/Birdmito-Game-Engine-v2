import { n } from "vitest/dist/types-2b1c412e";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { TextRenderer } from "../engine/TextRenderer";

export class RoundDisplayBehaviour extends Behaviour {

    roundTip:string = ' '
    roundNum:number = 0
    roundTotalNum:number = 1

    onStart(): void {

        this.changeRoundTip()
    
    }

    onUpdate(): void {    


        this.gameObject.getBehaviour(TextRenderer).text = this.roundTip
    
    }

    changeRoundTip(){
        
        console.log('回合跳转')

        if(this.roundNum<this.roundTotalNum){

            this.roundNum += 1 

        }
        else{

            this.roundNum = this.roundNum
        }

        this.roundTip = '当前回合数: ' + this.roundNum.toString() + ' 总回合数：' + this.roundTotalNum.toString()


    }
}