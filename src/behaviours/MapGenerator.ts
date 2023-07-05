export enum TerrainType {
  Ocean,     // 海洋
  Land,      // 陆地
  Plain,     // 平原
  Lake,      // 湖泊
  Mountain,  // 山脉
  Forest,    // 森林
}

export class MapGenerator {
  private width: number;
  private height: number;
  private landPercentage: number;
  private landNum: number = 1;

  constructor(width: number, height: number, landPercentage: number, landNum: number = 1) {
    this.width = width;
    this.height = height;
    this.landPercentage = landPercentage;
    this.landNum = landNum;
  }

  generateMap(): TerrainType[][] {
    const map: TerrainType[][] = [];

    // 初始化地图，所有方块都设置为海洋类型
    for (let y = 0; y < this.height; y++) {
      const row: TerrainType[] = [];
      for (let x = 0; x < this.width; x++) {
        row.push(TerrainType.Ocean);
      }
      map.push(row);
    }

    for(let i = 0; i < this.landNum; i++) {
      // 根据陆地百分比计算陆地方块数
      const numLandTiles = Math.floor((this.width * this.height * this.landPercentage) / 100)/this.landNum;
  
      // 使用随机行走算法生成初始陆地方块
      let landCount = 0;
      let startX = Math.floor(Math.random() * this.width);
      let startY = Math.floor(Math.random() * this.height);
  
      while (landCount < numLandTiles) {
        if (map[startY][startX] === TerrainType.Ocean) {
          let currentLandCount = 0;
          const queue: [number, number][] = [[startX, startY]];
  
          while (currentLandCount < numLandTiles && queue.length > 0) {
            const [currentX, currentY] = queue.shift()!;
  
            if (
              currentX >= 0 &&
              currentX < this.width &&
              currentY >= 0 &&
              currentY < this.height &&
              map[currentY][currentX] === TerrainType.Ocean
            ) {
              map[currentY][currentX] = TerrainType.Land;
              currentLandCount++;
  
              // 将相邻方块加入队列进行探索
              queue.push([currentX - 1, currentY]); // 左方块
              queue.push([currentX + 1, currentY]); // 右方块
              queue.push([currentX, currentY - 1]); // 上方块
              queue.push([currentX, currentY + 1]); // 下方块
  
              // 随机打乱队列，以随机方向进行探索
              for (let i = queue.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [queue[i], queue[j]] = [queue[j], queue[i]];
              }
            }
          }
  
          landCount += currentLandCount;
        }
  
        // 查找下一个未探索的海洋方块，用于开始新的陆地区块
        startX = -1;
        startY = -1;
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            if (map[y][x] === TerrainType.Ocean) {
              startX = x;
              startY = y;
              break;
            }
          }
          if (startX !== -1 && startY !== -1) {
            break;
          }
        }
      }
  
      // 随机分配地形类型给陆地方块
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (map[y][x] === TerrainType.Land) {
            const randomNum = Math.random();
            if (randomNum < 0.4) {
              map[y][x] = TerrainType.Plain;
            } else if (randomNum < 0.5) {
              map[y][x] = TerrainType.Lake;
            } else if (randomNum < 0.7) {
              map[y][x] = TerrainType.Mountain;
            } else {
              map[y][x] = TerrainType.Forest;
            }
          }
        }
      }

    }

    return map;
  }
}

