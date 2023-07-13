// 创建一个表示节点的类
export class myNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  cost: number; // 行动点消耗数
  parent: myNode | null;

  constructor(x: number, y: number, cost: number) {
    this.x = x;
    this.y = y;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.cost = cost;
    this.parent = null;
  }
}
// 创建 A* 算法类
export class AStar {
  grid: myNode[][];
  openList: myNode[];
  closedList: myNode[];

  constructor(grid: myNode[][]) {
    this.grid = grid;
    this.openList = [];
    this.closedList = [];
  }

  // 计算两个节点之间的曼哈顿距离
  manhattanDistance(myNodeA: myNode, myNodeB: myNode): number {
    return Math.abs(myNodeA.x - myNodeB.x) + Math.abs(myNodeA.y - myNodeB.y);
  }

  // 寻找最短路径
  findPath(startmyNode: myNode, endmyNode: myNode): myNode[] | null {
    this.openList.push(startmyNode);

    while (this.openList.length > 0) {
      let currentmyNode = this.openList[0];
      let currentIndex = 0;

      for (let i = 1; i < this.openList.length; i++) {
        if (
          this.openList[i].f < currentmyNode.f ||
          (this.openList[i].f === currentmyNode.f && this.openList[i].cost < currentmyNode.cost)
        ) {
          currentmyNode = this.openList[i];
          currentIndex = i;
        }
      }

      this.openList.splice(currentIndex, 1);
      this.closedList.push(currentmyNode);

      if (currentmyNode === endmyNode) {
        let path: myNode[] = [];
        let current = currentmyNode;

        while (current !== startmyNode) {
          path.unshift(current);
          current = current.parent!;
        }

        return path;
      }

      // 获取当前节点的相邻节点
      let neighbors: myNode[] = [];
      let { x, y } = currentmyNode;

      if (x > 0) neighbors.push(this.grid[x - 1][y]);
      if (x < this.grid.length - 1) neighbors.push(this.grid[x + 1][y]);
      if (y > 0) neighbors.push(this.grid[x][y - 1]);
      if (y < this.grid[0].length - 1) neighbors.push(this.grid[x][y + 1]);

      for (let neighbor of neighbors) {
        if (neighbor === null || this.closedList.includes(neighbor)) continue;

        let gScore = currentmyNode.g + neighbor.cost;
        let gScoreIsBest = false;

        if (!this.openList.includes(neighbor)) {
          gScoreIsBest = true;
          neighbor.h = this.manhattanDistance(neighbor, endmyNode);
          this.openList.push(neighbor);
        } else if (gScore < neighbor.g) {
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          neighbor.parent = currentmyNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }

    return null;
  }
}