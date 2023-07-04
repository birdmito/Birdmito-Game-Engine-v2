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
  
    constructor(width: number, height: number, landPercentage: number) {
      this.width = width;
      this.height = height;
      this.landPercentage = landPercentage;
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
  
      // 根据陆地百分比计算陆地方块数
      const numLandTiles = Math.floor((this.width * this.height * this.landPercentage) / 100);
  
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
            if (randomNum < 0.25) {
              map[y][x] = TerrainType.Plain;
            } else if (randomNum < 0.4) {
              map[y][x] = TerrainType.Lake;
            } else if (randomNum < 0.6) {
              map[y][x] = TerrainType.Mountain;
            } else {
              map[y][x] = TerrainType.Forest;
            }
          }
        }
      }
  
      return map;
    }
  }
  
  // 配置
  const width = 10;                // 地图宽度
  const height = 10;               // 地图高度
  const landPercentage = 30;       // 陆地百分比
  
  // 生成地图
  const generator = new MapGenerator(width, height, landPercentage);
  const map = generator.generateMap();
  
  // 为岛屿设置随机地形类型
    const numIslands = Math.floor((width * height * landPercentage) / 100);
  
    for (let i = 0; i < numIslands; i++) {
      const islandX = Math.floor(Math.random() * width);
      const islandY = Math.floor(Math.random() * height);
      
      // 随机分配地形类型给岛屿方块
      const randomNum = Math.random();
      if (randomNum < 0.25) {
        map[islandY][islandX] = TerrainType.Plain;     // 平原
      } else if (randomNum < 0.6) {                    // 更新此条件
        map[islandY][islandX] = TerrainType.Mountain;  // 山脉
      } else {
        map[islandY][islandX] = TerrainType.Forest;    // 森林
      }
    }
  
  // 打印生成的地图
  for (let y = 0; y < height; y++) {
    let row = '';
    for (let x = 0; x < width; x++) {
      switch (map[y][x]) {
        case TerrainType.Ocean:
          row += ' O ';         // 海洋
          break;
        case TerrainType.Land:
          row += ' 陆 ';        // 陆地
          break;
        case TerrainType.Plain:
          row += ' 平 ';        // 平原
          break;
        case TerrainType.Lake:
          row += ' 湖 ';        // 湖泊
          break;
        case TerrainType.Mountain:
          row += ' 山 ';        // 山脉
          break;
        case TerrainType.Forest:
          row += ' 森 ';        // 森林
          break;
      }
    }
    console.log(row);
  }
  
  