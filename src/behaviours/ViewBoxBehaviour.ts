import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { Transform } from "../engine/Transform";
import { Camera } from "./Camera";

export class ViewBoxBehaviour extends Behaviour {

    cameraTransorm :Transform = getGameObjectById("CameraRoot").getBehaviour(Transform);
    
    static viewBoxOriXPos = 1118;  //小地图起始X坐标
    static viewBoxOriYPos = 87;  //小地图起始Y坐标
    static worldWidth :5760
    static worldHeight :3840
    static worldGameMiniMapXRatio =  0.031; //游戏世界与小地图X方向比例  
    static worldGameMiniMapYRatio = 0.0377; //游戏世界与小地图Y方向比例

    onStart(): void {
        if(this.cameraTransorm.x > 0 ){
            this.gameObject.getBehaviour(Transform).x += this.cameraTransorm.x * ViewBoxBehaviour.worldGameMiniMapXRatio;
            this.gameObject.getBehaviour(Transform).y += this.cameraTransorm.y * ViewBoxBehaviour.worldGameMiniMapYRatio;
        }
        this.gameObject.getBehaviour(Transform).scaleX = this.cameraTransorm.scaleX * ViewBoxBehaviour.worldGameMiniMapXRatio;
        this.gameObject.getBehaviour(Transform).scaleY = this.cameraTransorm.scaleY * ViewBoxBehaviour.worldGameMiniMapYRatio;
        console.log("视野框大小：", this.gameObject.getBehaviour(Transform).scaleX,this.gameObject.getBehaviour(Transform).scaleY)
        console.log('视野框起始位置: ' ,this.gameObject.getBehaviour(Transform).x,this.gameObject.getBehaviour(Transform).y);
    }

    onUpdate(): void {
        
            this.gameObject.getBehaviour(Transform).x = ViewBoxBehaviour.viewBoxOriXPos + this.cameraTransorm.x * ViewBoxBehaviour.worldGameMiniMapXRatio  ;
            this.gameObject.getBehaviour(Transform).y = ViewBoxBehaviour.viewBoxOriYPos + this.cameraTransorm.y * ViewBoxBehaviour.worldGameMiniMapYRatio ;

        this.gameObject.getBehaviour(Transform).scaleX = this.cameraTransorm.scaleX * ViewBoxBehaviour.worldGameMiniMapXRatio;
        this.gameObject.getBehaviour(Transform).scaleY = this.cameraTransorm.scaleY * ViewBoxBehaviour.worldGameMiniMapYRatio;
        this.gameObject.onMouseLeftDown = () =>{       
            console.log('视野框当前位置: ' ,this.gameObject.getBehaviour(Transform).x,this.gameObject.getBehaviour(Transform).y);
            console.log("摄像机当前位置： ",this.cameraTransorm.x,this.cameraTransorm.y);
            console.log('视野框当前大小: ' ,this.gameObject.getBehaviour(Transform).scaleX,this.gameObject.getBehaviour(Transform).scaleY);
        }
    }
}


//小地图长：262.3
//小地图宽：227.5

//视野框大小为 0.05时 ：视野框移动范围：1070-1236.3，60-233.5；
//视野框大小为 0.05,锚点在中心时 ：视野框移动范围：1118-1284.3，87-260.5；
