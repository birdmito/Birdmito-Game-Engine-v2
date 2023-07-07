import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ProvincePrefabBinding } from "../bindings/ProvincePrefabBinding";
import { number } from "../engine/validators/number";
import { GameObject, getGameObjectById } from "../engine";
import { Province } from "./Province";
import { MapGenerator, TerrainType } from "./MapGenerator";
import { BitmapRenderer } from "../engine/BitmapRenderer";

export class ProvinceGenerator extends Behaviour {
    gridSizeX: number = 30;
    gridSizeY: number = 30;
    gridSpace: number = 172;
    landPercentage: number = 40;
    landNum: number = 10;

    // static provinces: GameObject[][] = [];

    onStart(): void {


        const mapGenerator = new MapGenerator(this.gridSizeX, this.gridSizeY, this.landPercentage, this.landNum);
        const generatedTerrain: TerrainType[][] = mapGenerator.generateMap();

        // 创建六边形网格坐标数组
        const hexGrid = this.createHexGrid(this.gridSizeX, this.gridSizeY, this.gridSpace);
        // 创建省份
        for (let i = 0; i < this.gridSizeY; i++) {
            for (let j = 0; j < this.gridSizeX; j++) {
                const province = this.gameObject.engine.createPrefab(new ProvincePrefabBinding());
                const miniProvince = this.gameObject.engine.createPrefab(new ProvincePrefabBinding());
                province.getBehaviour(Transform).x = hexGrid[i][j].x;
                province.getBehaviour(Transform).y = hexGrid[i][j].y;
                miniProvince.getBehaviour(Transform).x = hexGrid[i][j].x; //小地图省份x坐标
                miniProvince.getBehaviour(Transform).y = hexGrid[i][j].y;   //小地图省份y坐标
                const provinceBehaviour = province.getBehaviour(Province); 
                const miniProvinceBehaviour = miniProvince.getBehaviour(Province);//小地图中的省份
                provinceBehaviour.coord = { x: j, y: i };
                this.gameObject.addChild(province);
                getGameObjectById("MiniMap").addChild(miniProvince);
                if (!Province.provinces[j])
                    Province.provinces[j] = [];
                    Province.provinces[j][i] = province;

                // console.log(generatedTerrain[j][i]);
                switch (generatedTerrain[j][i]) {
                    case 0:
                        provinceBehaviour.isOwnable = false;
                        break;
                    default:
                        provinceBehaviour.isOwnable = true;
                        break;
                }
                this.randomSubTerrain(provinceBehaviour, miniProvinceBehaviour,generatedTerrain[j][i]);
            }
        }
    }


    randomSubTerrain(provinceBehaviour: Province,miniProvinceBehaviour:Province,mainTerrain: TerrainType) {
        const mainRandomPercent = (Math.random() + 1) / 2;
        const subRandomPercent1 = Math.random() * (1 - mainRandomPercent)
        const subRandomPercent2 = Math.random() * (1 - mainRandomPercent - subRandomPercent1)
        const subRandomPercent3 = 1 - mainRandomPercent - subRandomPercent1 - subRandomPercent2;

        // console.log("mainTerrain: " + mainTerrain + " Percent: " + mainRandomPercent);

        var url;
        switch (mainTerrain) {
            case TerrainType.Ocean:
                //生成一个1-9的随机数
                url = this.randomSelectUrl('./assets/images/Map_TerrainOcean_', 9, 100);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
            case TerrainType.Plain:
                provinceBehaviour.plainPercent = mainRandomPercent;
                provinceBehaviour.forestPercent = subRandomPercent1;
                provinceBehaviour.mountainPercent = subRandomPercent2;
                provinceBehaviour.lakePercent = subRandomPercent3;
                url = this.randomSelectUrl('./assets/images/Map_TerrainPlain_', 1);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
            case TerrainType.Forest:
                provinceBehaviour.forestPercent = mainRandomPercent;
                provinceBehaviour.plainPercent = subRandomPercent1;
                provinceBehaviour.mountainPercent = subRandomPercent2;
                provinceBehaviour.lakePercent = subRandomPercent3;
                url = this.randomSelectUrl('./assets/images/Map_TerrainForest_', 5);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
            case TerrainType.Mountain:
                provinceBehaviour.mountainPercent = mainRandomPercent;
                provinceBehaviour.plainPercent = subRandomPercent1;
                provinceBehaviour.forestPercent = subRandomPercent2;
                provinceBehaviour.lakePercent = subRandomPercent3;
                url = this.randomSelectUrl('./assets/images/Map_TerrainMountain_', 3);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
            case TerrainType.Lake:
                provinceBehaviour.lakePercent = mainRandomPercent;
                provinceBehaviour.plainPercent = subRandomPercent1;
                provinceBehaviour.forestPercent = subRandomPercent2;
                provinceBehaviour.mountainPercent = subRandomPercent3;
                url = this.randomSelectUrl('./assets/images/Map_TerrainLake_', 1);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
        }


    }

    randomSelectUrl(frontUrl: string, urlNum: number, mainRandom = 0): string {
        var randomNum = Math.floor(Math.random() * (urlNum + mainRandom));
        if (randomNum > urlNum - 1) {
            randomNum = 0;
        }
        const url: string = frontUrl + randomNum.toString() + '.png';
        return url;
    }

    // 创建六边形网格坐标数组
    createHexGrid(gridSizeX, gridSizeY, spacing) {
        const hexGrid = [];
        for (let row = 0; row < gridSizeX; row++) {
            const hexRow = [];
            for (let col = 0; col < gridSizeY; col++) {
                const x = col * spacing + (row % 2) * spacing / 2;
                const y = row * spacing * (Math.sqrt(3) / 2);

                hexRow.push({ x: x, y: y });
            }
            hexGrid.push(hexRow);
        }
        return hexGrid;
    }

    // static updateProvince() {
    //     //每回合开始时，所有领地给予所属国家产出
    //     for (let i = 0; i < Province.provinces.length; i++) {
    //         for (let j = 0; j < Province.provinces[i].length; j++) {
    //             const province = Province.provinces[i][j].getBehaviour(Province);
    //             province.giveOwnerProduction();
    //             province.updateBuildingInfo();
    //         }
    //     }
    // }
}
