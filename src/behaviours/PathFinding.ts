import { Behaviour } from "../engine/Behaviour";
import { AStar, myNode } from "./AStar";
import { Province } from "./Province";

export class PathFinding extends Behaviour {
    static grid: myNode[][] = [];
    static astar: AStar;
    onStart(): void {
        // 创建 A* 实例
        PathFinding.astar = new AStar(PathFinding.grid);
    }

    static findPath(startProvice: Province, endProvince: Province): Province[] | null {
        console.log(`起点坐标：${startProvice.coord.x}, ${startProvice.coord.y}，终点坐标：${endProvince.coord.x}, ${endProvince.coord.y}`);
        // 指定起始节点和结束节点
        const startNode = PathFinding.grid[startProvice.coord.x][startProvice.coord.y];
        const endNode = PathFinding.grid[endProvince.coord.x][endProvince.coord.y];

        // 寻找最短路径
        const path = PathFinding.astar.findPath(startNode, endNode);

        if (path) {
            console.log(`找到路径`);
            console.log(path);
            const provinces: Province[] = [];
            for (let i = 0; i < path.length; i++) {
                provinces.push(Province.provincesObj[path[i].x][path[i].y].getBehaviour(Province) as Province);
            }
            return provinces;
        } else {
            console.log(`无法找到路径`);
            return null;
        }
    }

    static noobFindPath(startProvince: Province, endProvince: Province): Province {
        //直接走折线，优先走x轴
        if (!startProvince || !endProvince) {
            console.log("startProvince or endProvince is null");
            return null;
        }
        if (startProvince.coord.x === endProvince.coord.x) {
            if (startProvince.coord.y < endProvince.coord.y) {
                return Province.provincesObj[startProvince.coord.x][startProvince.coord.y + 1].getBehaviour(Province) as Province;
            } else {
                return Province.provincesObj[startProvince.coord.x][startProvince.coord.y - 1].getBehaviour(Province) as Province;
            }
        } else {
            if (startProvince.coord.x < endProvince.coord.x) {
                return Province.provincesObj[startProvince.coord.x + 1][startProvince.coord.y].getBehaviour(Province) as Province;
            } else {
                return Province.provincesObj[startProvince.coord.x - 1][startProvince.coord.y].getBehaviour(Province) as Province;
            }
        }
    }
}

