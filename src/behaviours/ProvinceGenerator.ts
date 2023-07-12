import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ProvincePrefabBinding } from "../bindings/ProvincePrefabBinding";
import { number } from "../engine/validators/number";
import { GameObject, getGameObjectById } from "../engine";
import { Province } from "./Province";
import { MapGenerator, TerrainType } from "./MapGenerator";
import { BitmapRenderer } from "../engine/BitmapRenderer";

export class ProvinceGenerator extends Behaviour {
    gridSizeX: number = 10;
    gridSizeY: number = 10;
    gridSpace: number = 172;
    landPercentage: number = 40;
    landNum: number = 10;
    static hexGridForOthers:{x:number,y:number}[] = [];
    // static provinces: GameObject[][] = [];

    onStart(): void {


        const mapGenerator = new MapGenerator(this.gridSizeX, this.gridSizeY, this.landPercentage, this.landNum);
        const generatedTerrain: TerrainType[][] = mapGenerator.generateMap();

        // 创建六边形网格坐标数组
        const hexGrid = this.createHexGrid(this.gridSizeX, this.gridSizeY, this.gridSpace);
        ProvinceGenerator.hexGridForOthers=hexGrid;
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
                if (!Province.provincesObj[j])
                    Province.provincesObj[j] = [];
                Province.provincesObj[j][i] = province;

                // console.log(generatedTerrain[j][i]);
                switch (generatedTerrain[j][i]) {
                    case 0:
                        provinceBehaviour.isOwnable = false;
                        break;
                    default:
                        provinceBehaviour.isOwnable = true;
                        break;
                }
                this.randomSubTerrain(provinceBehaviour, miniProvinceBehaviour, generatedTerrain[j][i]);
                provinceBehaviour.updateApCost();
            }
        }
    }


    randomSubTerrain(provinceBehaviour: Province, miniProvinceBehaviour: Province, mainTerrain: TerrainType) {
        const mainRandomPercent = (Math.random() + 1) / 2;
        const subRandomPercent1 = Math.random() * (1 - mainRandomPercent)
        const subRandomPercent2 = Math.random() * (1 - mainRandomPercent - subRandomPercent1)
        const subRandomPercent3 = 1 - mainRandomPercent - subRandomPercent1 - subRandomPercent2;

        // console.log("mainTerrain: " + mainTerrain + " Percent: " + mainRandomPercent);

        var url;
        switch (mainTerrain) {
            case TerrainType.Ocean:
                //生成一个1-9的随机数
                url = ProvinceGenerator.randomSelectUrl('./assets/images/Map_TerrainOcean_', 1, 100);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
            case TerrainType.Plain:
                provinceBehaviour.plainPercent = mainRandomPercent;
                provinceBehaviour.forestPercent = subRandomPercent1;
                provinceBehaviour.mountainPercent = subRandomPercent2;
                provinceBehaviour.lakePercent = subRandomPercent3;
                url = ProvinceGenerator.randomSelectUrl('./assets/images/Map_TerrainPlain_', 6);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
            case TerrainType.Forest:
                provinceBehaviour.forestPercent = mainRandomPercent;
                provinceBehaviour.plainPercent = subRandomPercent1;
                provinceBehaviour.mountainPercent = subRandomPercent2;
                provinceBehaviour.lakePercent = subRandomPercent3;
                url = ProvinceGenerator.randomSelectUrl('./assets/images/Map_TerrainForest_', 1);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
            case TerrainType.Mountain:
                provinceBehaviour.mountainPercent = mainRandomPercent;
                provinceBehaviour.plainPercent = subRandomPercent1;
                provinceBehaviour.forestPercent = subRandomPercent2;
                provinceBehaviour.lakePercent = subRandomPercent3;
                url = ProvinceGenerator.randomSelectUrl('./assets/images/Map_TerrainMountain_', 3);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
            case TerrainType.Lake:
                provinceBehaviour.lakePercent = mainRandomPercent;
                provinceBehaviour.plainPercent = subRandomPercent1;
                provinceBehaviour.forestPercent = subRandomPercent2;
                provinceBehaviour.mountainPercent = subRandomPercent3;
                url = ProvinceGenerator.randomSelectUrl('./assets/images/Map_TerrainLake_', 3);
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                miniProvinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = url;
                break;
        }


    }

    static randomSelectUrl(frontUrl: string, urlNum: number, mainRandom = 0): string {
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

    static areAdjacent(x1: Number, y1: Number, x2: Number, y2: Number): boolean {
        // 当前单元格朝上的相邻位置的偏移量
        //console两个坐标
        console.log("x1:" + x1 + " y1:" + y1 + " x2:" + x2 + " y2:" + y2);
        var offsets;
        if (Number(y1) % 2 === 0 || y1 === 0) {
            console.log("y1是偶数");
            //y为偶数时[2,2]：
            //0 - - -
            //1 + + -
            //2 + - +
            //3 + + -
            offsets = [
                [-1, 0], // 左
                [1, 0], // 右
                [-1, -1], // 左上
                [0, -1], // 右上
                [-1, 1], // 左下
                [0, 1] // 右下
            ];
        } else {
            console.log("y1是奇数");
            //+表示相邻格
            //y为奇数时[2,1]：
            //0 - + +
            //1 + - +
            //2 - + +
            offsets = [
                [-1, 0], // 左
                [1, 0], // 右
                [0, -1], // 左上
                [1, -1], // 右上
                [0, 1], // 左下
                [1, 1] // 右下
            ];
        }

        // 判断两个坐标是否相邻
        for (var i = 0; i < offsets.length; i++) {
            var offset = offsets[i];
            if (x1 + offset[0] === x2 && y1 + offset[1] === y2) {
                return true;
            }
        }

        return false;
    }

    //输入坐标，返回相邻的坐标
    static getAdjacentCoords(x1: Number, y1: Number): { x: number, y: number }[] {
        // 当前单元格朝上的相邻位置的偏移量
        //console两个坐标
        console.log("x1:" + x1 + " y1:" + y1);
        var offsets;
        if (Number(y1) % 2 === 0 || y1 === 0) {
            console.log("y1是偶数");
            //y为偶数时[2,2]：
            //0 - - -
            //1 + + -
            //2 + - +
            //3 + + -
            offsets = [
                [-1, 0], // 左
                [1, 0], // 右
                [-1, -1], // 左上
                [0, -1], // 右上
                [-1, 1], // 左下
                [0, 1] // 右下
            ];
        } else {
            console.log("y1是奇数");
            //+表示相邻格
            //y为奇数时[2,1]：
            //0 - + +
            //1 + - +
            //2 - + +
            offsets = [
                [-1, 0], // 左
                [1, 0], // 右
                [0, -1], // 左上
                [1, -1], // 右上
                [0, 1], // 左下
                [1, 1] // 右下
            ];
        }

        // 判断两个坐标是否相邻
        var adjacent: { x: number, y: number }[] = [];
        for (var i = 0; i < offsets.length; i++) {
            var offset = offsets[i];
            adjacent.push({ x: x1 + offset[0], y: y1 + offset[1] });
        }

        return adjacent;
    }

}