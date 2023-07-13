import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { Transform } from "../engine/Transform";
import { Camera } from "./Camera";

export class ViewBoxBehaviour extends Behaviour {

    cameraTransorm :Transform = getGameObjectById("CameraRoot").getBehaviour(Transform);
    
    static viewBoxOriXPos = 1715;  //小地图起始X坐标
    static viewBoxOriYPos = 150;  //小地图起始Y坐标
    static worldGameMiniMapXRatio =  0.0492; //游戏世界与小地图X方向比例  
    static worldGameMiniMapYRatio = 0.055; //游戏世界与小地图Y方向比例

    onStart(): void {
        this.gameObject.getBehaviour(Transform).x += this.cameraTransorm.x * ViewBoxBehaviour.worldGameMiniMapXRatio;
        this.gameObject.getBehaviour(Transform).y += this.cameraTransorm.y * ViewBoxBehaviour.worldGameMiniMapYRatio;

        this.gameObject.getBehaviour(Transform).scaleX = this.cameraTransorm.scaleX * ViewBoxBehaviour.worldGameMiniMapXRatio;
        this.gameObject.getBehaviour(Transform).scaleY = this.cameraTransorm.scaleY * ViewBoxBehaviour.worldGameMiniMapYRatio;
    }

    onUpdate(): void {
        this.changeViewBoxPosition();
        this.changeViewBoxSize();
    }

    changeViewBoxPosition(){
        const viewBoxOriXPos = ViewBoxBehaviour.viewBoxOriXPos;
        const viewBoxOriYPos = ViewBoxBehaviour.viewBoxOriYPos;
        const worldGameMiniMapXRatio = ViewBoxBehaviour.worldGameMiniMapXRatio;
        const worldGameMiniMapYRatio = ViewBoxBehaviour.worldGameMiniMapYRatio;
        
        const newX = viewBoxOriXPos + this.cameraTransorm.x * worldGameMiniMapXRatio;
        const newY = viewBoxOriYPos + this.cameraTransorm.y * worldGameMiniMapYRatio;
        

        if (newX < 1715) {
          this.gameObject.getBehaviour(Transform).x = 1715;
        } else if (newX > 1893) {
          this.gameObject.getBehaviour(Transform).x = 1893;
        } else {
          this.gameObject.getBehaviour(Transform).x = newX;
        }
        
        if (newY < 154) {
          this.gameObject.getBehaviour(Transform).y = 154;
        } else if (newY > 331) {
          this.gameObject.getBehaviour(Transform).y = 331;
        } else {
          this.gameObject.getBehaviour(Transform).y = newY;
        }
        
    }
    changeViewBoxSize(){
        const worldGameMiniMapXRatio = ViewBoxBehaviour.worldGameMiniMapXRatio;
        const worldGameMiniMapYRatio = ViewBoxBehaviour.worldGameMiniMapYRatio;

        this.gameObject.getBehaviour(Transform).scaleX = this.cameraTransorm.scaleX * worldGameMiniMapXRatio * 0.8;
        this.gameObject.getBehaviour(Transform).scaleY = this.cameraTransorm.scaleY * worldGameMiniMapYRatio * 0.8;
    }
}


//小地图长：283.3
//小地图宽：253

//视野框大小为 0.05时 ：视野框移动范围：1070-1236.3，60-233.5；
//视野框大小为 0.05,锚点在中心时 ：视野框移动范围：1118-1284.3，87-260.5；

//uiroot:1:1 时 map：（1640，90）view box ：（1688，117）

//y:340
//x:1885