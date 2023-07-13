import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Building } from "./Building";
import { Nation } from "./Nation";
import { ProductingItem } from "./ProductingItem";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { UnitParam } from "./UnitParam";
import { UnitBehaviour } from "./UnitBehaviour";
import { generateTip } from "./Tip";
import { ObjectDisableSimulator } from "./ObjectDisableSimulator";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { GameProcess } from "./GameProcess";
import { UI_UpdateSelectedObjInfo } from "./UI_UpdateSelectedObjInfo";

//在ui界面中，根据EventText的不同，实现点击后建造或者拆除等生产队列操作
export class UI_ItemButton extends Behaviour {
    eventText: string;
    itemName: string;
    idInList: number = 0;

    onStart(): void {
        console.log("start")

        // this.gameObject.parent.getChildById("_ItemEventIcon").active = false;
        // switch (this.eventText) {
        //     case "建造":
        //         break;
        //     default:
        //         this.gameObject.parent.getChildById("_ItemInfo").active = false;
        // }  //根据不同的事件类型，设置不同的信息显示
        this.gameObject.parent.getChildById("_ItemInfo").active = false;


        switch (this.eventText) {
            case "建造":
                this.gameObject.parent.getChildById("_ItemEventIcon").getBehaviour(BitmapRenderer).source = './assets/images/Icon_Build.png';
                break;
            case "拆除":
                this.gameObject.parent.getChildById("_ItemEventIcon").getBehaviour(BitmapRenderer).source = './assets/images/Icon_Destroy.png';
                break;
            case "取消":
                this.gameObject.parent.getChildById("_ItemEventIcon").getBehaviour(BitmapRenderer).source = './assets/images/Icon_Destroy.png';
                break;
            case "招募":
                this.gameObject.parent.getChildById("_ItemEventIcon").getBehaviour(BitmapRenderer).source = './assets/images/Icon_ProduceUnit.png';
                break;
            case "研究":
                this.gameObject.parent.getChildById("_ItemEventIcon").getBehaviour(BitmapRenderer).source = './assets/images/Icon_Build.png';
                break;
        }  //根据不同的事件类型，设置不同的图标
    }
    onUpdate(): void {
        this.gameObject.onMouseHover = () => {
            // console.log(`鼠标悬浮于${this.itemName}按钮`);
            this.gameObject.parent.getChildById("_ItemEventIcon").active = true;  //显示图标
            this.gameObject.parent.getChildById("_ItemInfo").active = true;
        }

        this.gameObject.onMouseLeave = () => {
            this.gameObject.parent.getChildById("_ItemEventIcon").active = false;  //显示图标
            // switch (this.eventText) {
            //     case "建造":
            //         break;
            //     default:
            //         this.gameObject.parent.getChildById("_ItemInfo").active = false;
            // }  //根据不同的事件类型，设置不同的信息显示
            this.gameObject.parent.getChildById("_ItemInfo").active = false;
        }

        this.gameObject.onMouseLeftDown = () => {
            const targetProvince = SelectedObjectInfoMangaer.selectedBehaviour as Province;
            var originBuilding: Building;
            var originUnitParam: UnitParam;
            if (targetProvince) {
                originBuilding = Building.getProvinceBuildingByName(targetProvince, this.itemName);
                originUnitParam = UnitParam.getProvinceUnitParamByName(targetProvince, this.itemName);
            }
            switch (this.eventText) {
                case "建造":
                    console.log("建造 is clicked");
                    const newBuilding = Building.copyBuilding(originBuilding);
                    Nation.nations[GameProcess.playerNationId].buildBuilding(targetProvince, newBuilding.name);
                    break;
                case "拆除":
                    targetProvince.buildingList.splice(this.idInList, 1);  //从建筑列表中删除
                    targetProvince.updateProvinceProperties();  //拆除建筑时，资源产出减少
                    console.log("拆除成功");
                    console.log("获得金币：" + originBuilding.cost);
                    Nation.nations[GameProcess.playerNationId].dora += originBuilding.cost;
                    break;
                case "取消":
                    console.log("取消 is clicked");
                    targetProvince.productQueue.splice(this.idInList, 1);  //从生产列表中删除
                    console.log("取消成功");
                    if (originBuilding) {
                        console.log("获得金币：" + originBuilding.cost);
                        Nation.nations[GameProcess.playerNationId].dora += originBuilding.cost;
                    }
                    if (originUnitParam) {
                        console.log("获得金币：" + originUnitParam.cost);
                        Nation.nations[GameProcess.playerNationId].dora += originUnitParam.cost;
                    }
                    break;
                case "招募":
                    console.log("招募 is clicked");
                    //向生产队列中push item
                    Nation.nations[GameProcess.playerNationId].recruitUnit(targetProvince, this.itemName);
                    break;
                case "研究":
                    console.log("研究 is clicked");
                    //更改当前科技
                    Nation.nations[GameProcess.playerNationId].currentTechName = this.itemName;
                    break;
                default:
                    console.log("Item" + this.gameObject.id + ": " + this.itemName + "没有设置点击事件)");
                    return;
            }

            //更新UI
            if (SelectedObjectInfoMangaer.selectedInfoWindow) {
                const window = SelectedObjectInfoMangaer.selectedInfoWindow
                window.getBehaviour(UI_UpdateSelectedObjInfo).updateSelectedProvinceBuildingListUI();
                window.getBehaviour(UI_UpdateSelectedObjInfo).updateSelectedProvinceProductQueueUI();
            }
        }
    }
}
