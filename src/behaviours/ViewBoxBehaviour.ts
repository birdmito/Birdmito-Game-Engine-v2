import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";

export class ViewBoxBehaviour extends Behaviour {

    cameraTransorm :Transform = getGameObjectById("CameraRoot").getBehaviour(Transform);
    
    onStart(): void {
        this.gameObject.getBehaviour(Transform).x += this.cameraTransorm.x * (140/5760);
        this.gameObject.getBehaviour(Transform).y += this.cameraTransorm.y * (160/4600);
        console.log('视野框起始位置: ' ,this.gameObject.getBehaviour(Transform).x,this.gameObject.getBehaviour(Transform).y);
    }

    onUpdate(): void {
        this.gameObject.getBehaviour(Transform).x = 1070 + this.cameraTransorm.x * (140/5760);
        this.gameObject.getBehaviour(Transform).y = 60 + this.cameraTransorm.y * (160/4600);
        this.gameObject.onMouseLeftDown = () =>{       
            console.log('视野框当前位置: ' ,this.gameObject.getBehaviour(Transform).x,this.gameObject.getBehaviour(Transform).y);
            console.log("摄像机当前位置： ",this.cameraTransorm.x,this.cameraTransorm.y);
        }
    }

}
//小地图长：1070-1210 ：140
//小地图宽：60-240 ：160

//游戏世界长：5760
//游戏世界宽：4600

