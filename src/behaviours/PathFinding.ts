import { Behaviour } from "../engine/Behaviour";
import { AStar, myNode } from "./AStar";

export class PathFinding extends Behaviour {
    static grid: myNode[][] = [];
    onStart(): void {
    }

    onUpdate(): void {
        // // 创建 A* 实例
        // const astar = new AStar(PathFinding.grid);

        // // 指定起始节点和结束节点
        // const startNode = PathFinding.grid[0][0];
        // const endNode = PathFinding.grid[8][5];
        
        // // 寻找最短路径
        // const path = astar.findPath(startNode, endNode);
        
        // if (path) {
        //     // 输出路径
        //     console.log("找到最短路径:");
        //     for (let node of path) {
        //     console.log(`(${node.x}, ${node.y})`);
        //     }
            
        //     // 计算总行动消耗
        //     let totalCost = 0;
        //     for (let node of path) {
        //     totalCost += node.cost;
        //     }
        //     console.log(`总行动消耗: ${totalCost}`);
        //     } else {
        //     console.log(`无法找到路径`);
        //     }
    }
}

