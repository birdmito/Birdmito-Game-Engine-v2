import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ProvincePrefabBinding } from "../bindings/ProvincePrefabBinding";
import { number } from "../engine/validators/number";
import { GameObject } from "../engine";
import { Province } from "./Province";
import { MapGenerator } from "./MapGenerator";
import { TerrainType } from "./MapGenerator";
import { BitmapRenderer } from "../engine/BitmapRenderer";

export class ProvinceManager extends Behaviour {
    // @number()
    gridSizeX: number = 30;
    // @number()
    gridSizeY: number = 30;
    // @number()
    gridSpace: number = 172;
    // @number()
    landPercentage: number = 20;

    static provinces: GameObject[][] = [];

    onStart(): void {

        const mapGenerator = new MapGenerator(this.gridSizeX, this.gridSizeY, this.landPercentage);
        const generatedTerrain:TerrainType[][] = mapGenerator.generateMap();

          // 为岛屿设置随机地形类型
        const numIslands = Math.floor((this.gridSizeX * this.gridSizeY * this.landPercentage) / 100);
    
        for (let i = 0; i < numIslands; i++) {
        const islandX = Math.floor(Math.random() * this.gridSizeX);
        const islandY = Math.floor(Math.random() * this.gridSizeY);
        
        // 随机分配地形类型给岛屿方块
        const randomNum = Math.random();
        if (randomNum < 0.25) {
            generatedTerrain[islandY][islandX] = TerrainType.Plain;     // 平原
        } else if (randomNum < 0.6) {                    // 更新此条件
            generatedTerrain[islandY][islandX] = TerrainType.Mountain;  // 山脉
        } else {
            generatedTerrain[islandY][islandX] = TerrainType.Forest;    // 森林
        }
        }

        console.log(generatedTerrain);
        
        // 创建六边形网格坐标数组
        const hexGrid = this.createHexGrid(this.gridSizeX, this.gridSizeY, this.gridSpace);
        // 创建省份
        for (let i = 0; i < this.gridSizeY; i++) {
            for (let j = 0; j < this.gridSizeX; j++) {
                const province = this.gameObject.engine.createPrefab(new ProvincePrefabBinding());
                province.getBehaviour(Transform).x = hexGrid[i][j].x;
                province.getBehaviour(Transform).y = hexGrid[i][j].y;
                const provinceBehaviour = province.getBehaviour(Province);
                provinceBehaviour.coord = { x: j, y: i };
                this.gameObject.addChild(province);
                if (!ProvinceManager.provinces[j])
                    ProvinceManager.provinces[j] = [];
                ProvinceManager.provinces[j][i] = province;

                console.log(generatedTerrain[j][i]);
                switch(generatedTerrain[j][i]) {
                    case 0:
                        provinceBehaviour.isOwnable = false;
                        break;
                    default:
                        provinceBehaviour.isOwnable = true;
                        break;
                }
                this.randomSubTerrain(provinceBehaviour, generatedTerrain[j][i]);
            }
        }

        
    }

    randomSubTerrain(provinceBehaviour:Province, mainTerrain:TerrainType) {
        const mainRandomPercent = (Math.random() +1)/2;
        const subRandomPercent1 = Math.random() * (1 - mainRandomPercent)
        const subRandomPercent2 = Math.random() * (1 - mainRandomPercent - subRandomPercent1)
        const subRandomPercent3 = 1 -mainRandomPercent- subRandomPercent1 - subRandomPercent2;

        console.log("mainTerrain: " + mainTerrain + " Percent: " + mainRandomPercent);

        switch(mainTerrain) {
            case TerrainType.Ocean: 
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = './assets/images/Map_TerrainOcean.png';
                break;
            case TerrainType.Plain: 
                provinceBehaviour.plainPercent = mainRandomPercent;
                provinceBehaviour.forestPercent = subRandomPercent1;
                provinceBehaviour.mountainPercent = subRandomPercent2;
                provinceBehaviour.lakePercent = subRandomPercent3;
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = './assets/images/Map_TerrainPlain.png';
                break;
            case TerrainType.Forest: 
                provinceBehaviour.forestPercent = mainRandomPercent;
                provinceBehaviour.plainPercent = subRandomPercent1;
                provinceBehaviour.mountainPercent = subRandomPercent2;
                provinceBehaviour.lakePercent = subRandomPercent3;
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = './assets/images/Map_TerrainForest.png';
                break;
            case TerrainType.Mountain:
                provinceBehaviour.mountainPercent = mainRandomPercent;
                provinceBehaviour.plainPercent = subRandomPercent1;
                provinceBehaviour.forestPercent = subRandomPercent2;
                provinceBehaviour.lakePercent = subRandomPercent3;
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = './assets/images/Map_TerrainMountain.png';
                break;
            case TerrainType.Lake:
                provinceBehaviour.lakePercent = mainRandomPercent;
                provinceBehaviour.plainPercent = subRandomPercent1;
                provinceBehaviour.forestPercent = subRandomPercent2;
                provinceBehaviour.mountainPercent = subRandomPercent3;
                provinceBehaviour.gameObject.children[0].getBehaviour(BitmapRenderer).source = './assets/images/Map_TerrainLake.png';
                break;
        }


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

    static updateProvince() {
        //每回合开始时，所有领地给予所属国家产出
        for (let i = 0; i < ProvinceManager.provinces.length; i++) {
            for (let j = 0; j < ProvinceManager.provinces[i].length; j++) {
                const province = ProvinceManager.provinces[i][j].getBehaviour(Province);
                province.giveOwnerProduction();
                province.updateBuildingInfo();
            }
        }
    }
}

