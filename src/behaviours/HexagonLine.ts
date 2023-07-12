import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { HexagonBorderRenderer } from "../engine/HexagonBorderRenderer";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { ProvinceGenerator } from "./ProvinceGenerator";

export class HexagonLine extends Behaviour {

    public static vertices :{x:number,y:number}[] = [];
    public static edgeMap = new Map();
    public static needJumpVertices:{x:number,y:number}[] = [];
    public static oldlistlength:number[] = [];
    

    onStart(): void {
      //将Border放到最上层
      const border=getGameObjectById("Border");
      const borderParent = border.parent;
      border.addBehaviour(new HexagonBorderRenderer());
      border.getBehaviour(HexagonBorderRenderer).hitAreaType = 'none';
      const length = borderParent.children.length
      
      for(let i =0;i<length;i++){
        borderParent.children[i]=borderParent.children[i+1]
      }
      borderParent.children[length-1]=border

      }


    onUpdate(): void {
      const newListLength:number[] = [];
      for(let i=1;i<=Nation.nationQuantity;i++){
        newListLength[i] = Nation.nations[i].provinceOwnedList.length
        if(newListLength[i]!=HexagonLine.oldlistlength[i]){
          HexagonLine.oldlistlength[i] = newListLength[i]

          Nation.nations[i].vertices = []
          Nation.nations[i].needJumpVertices = []
          
          this.caculateOwnerProvinces(i)
          this.judgeSameLine(i)
        }
      }
    }

    caculateOwnerProvinces(nationId:number){
      const ownedProvinces = Nation.nations[nationId].provinceOwnedList
      for(let i = 0; i < ownedProvinces.length; i++){
        console.log("hexGridForOthers[ownedProvinces[i].coord.x][ownedProvinces[i].coord.y]",
        ProvinceGenerator.hexGridForOthers[ownedProvinces[i].coord.x][ownedProvinces[i].coord.y])

        const province1 =  ProvinceGenerator.hexGridForOthers[ownedProvinces[i].coord.y][ownedProvinces[i].coord.x]
        
        this.caculateVertices(province1.x+86,province1.y+100,94,nationId)
      }
    }

    // 计算六边形的顶点坐标
    caculateVertices(centerX:number,centerY:number,radius:number,nationId:number){
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + Math.PI / 6;
            const x =(centerX + radius * Math.cos(angle));
            const y = (centerY + radius * Math.sin(angle));
            Nation.nations[nationId].vertices.push({ x, y });
        }
    }

    judgeSameLine(nationId:number){
      for(let i = 0; i <= Nation.nations[nationId].vertices.length-1; i++){
        let vertex1=Nation.nations[nationId].vertices[i]
        let vertex2=Nation.nations[nationId].vertices[i+1]

        if((i+1)%6!=0){
          //对于不是每个六边形的右上角的点
          for(let j = 1; j < Nation.nations[nationId].vertices.length; j++)
          {
            if(j==i){continue}
            let vertex3=Nation.nations[nationId].vertices[j]
            let vertex4=Nation.nations[nationId].vertices[j-1]
              if(this.judgeSameVertex(vertex1,vertex3) && this.judgeSameVertex(vertex2,vertex4)){
                //console.log("judge1",this.judgeSameVertex(vertex1,vertex3),"judge2",this.judgeSameVertex(vertex2,vertex4))
                console.log("judgeSameLine运行啦")
                Nation.nations[nationId].needJumpVertices.push(vertex1)
                Nation.nations[nationId].needJumpVertices.push(vertex4)
              }
          }
        }else{
          //对于每个六边形的右上角的点
          let vertex1=Nation.nations[nationId].vertices[i]
          let vertex2=Nation.nations[nationId].vertices[i-5]

          for(let j = 1; j < Nation.nations[nationId].vertices.length; j++){
            if(j==i){continue}
            let vertex3=Nation.nations[nationId].vertices[j]
            let vertex4=Nation.nations[nationId].vertices[j-1]
              if(this.judgeSameVertex(vertex1,vertex3) && this.judgeSameVertex(vertex2,vertex4)){
                //console.log("judge1",this.judgeSameVertex(vertex1,vertex3),"judge2",this.judgeSameVertex(vertex2,vertex4))
                console.log("judgeSameLine运行啦")
                Nation.nations[nationId].needJumpVertices.push(vertex1)
                Nation.nations[nationId].needJumpVertices.push(vertex4)
              }
          }
        }

      }
      
      const vertex1=Nation.nations[nationId].vertices[0]
      const vertex2=Nation.nations[nationId].vertices[Nation.nations[nationId].vertices.length-1]
      for(let j = 1; j < Nation.nations[nationId].vertices.length; j++)
      {
        const vertex3=Nation.nations[nationId].vertices[j]
        const vertex4=Nation.nations[nationId].vertices[j-1]
          if(this.judgeSameVertex(vertex1,vertex3) && this.judgeSameVertex(vertex2,vertex4)){
            //console.log("judge1",this.judgeSameVertex(vertex1,vertex3),"judge2",this.judgeSameVertex(vertex2,vertex4))
            console.log("judgeSameLine运行啦")
            Nation.nations[nationId].needJumpVertices.push(vertex2)
            Nation.nations[nationId].needJumpVertices.push(vertex4)
          }
        
      }


    }

    judgeSameVertex(vertex:{x:number,y:number},vertex2:{x:number,y:number}):boolean{
      const diffX = Math.abs(vertex.x - vertex2.x);
      const diffY = Math.abs(vertex.y - vertex2.y);
      if(diffX<10 && diffY<10){
        console.log(vertex,"相邻顶点",vertex2);
        //HexagonLine.vertices.splice(j,1);
        return true
      }else{
        return false
      }
    }

    showVertices(){
        console.log(HexagonLine.vertices);
        console.log(HexagonLine.needJumpVertices);
    }
    
    // map(){

    //     for (let i = 0; i < HexagonLine.vertices.length; i++) {
    //       const vertexA = HexagonLine.vertices[i];
    //       const vertexB = HexagonLine.vertices[(i + 1)];
        
    //       const edge = { vertexA, vertexB };
    //       const edgeKey = JSON.stringify(edge); // 将边对象转换为字符串作为map的key

    //       if (HexagonLine.edgeMap.has(edgeKey)) {
    //           // 边已经存在于map中，增加出现次数
    //           const count = HexagonLine.edgeMap.get(edgeKey);
    //           HexagonLine.edgeMap.set(edgeKey, count + 1);
    //       } else {
    //           // 边是第一次出现，初始化出现次数为1
    //           HexagonLine.edgeMap.set(edgeKey, 1);
    //       }
    //   }
      
    //   // 输出边和对应的出现次数
    //   HexagonLine.edgeMap.forEach((count, edgeKey) => {
    //       console.log(`Edge: ${edgeKey}, Count: ${count}`);
    //   });
    // }
}

                        // // 存储边的信息到 Map 中，并初始化重叠次数为 0
                        // const startVertexIndex = i;
                        // let endVertexIndex = i + 1;
                        // if (endVertexIndex === 6) {
                        //     endVertexIndex = 0; // 最后一条边连接回第一个顶点
                        // }
                        // const edgeKey = `Edge(${startVertexIndex}, ${endVertexIndex})`;
                        // const edgeValue = { start: HexagonLine.vertices[startVertexIndex], end: HexagonLine.vertices[endVertexIndex], overlapCount: 0 };
                        // HexagonLine.edgeMap.set(edgeKey, edgeValue);

            // 存储边的信息到 Map 中，并初始化重叠次数为 0
            // const startVertexIndex = i;
            // let endVertexIndex = i + 1;
            // if (endVertexIndex === 6) {
            //     endVertexIndex = 0; // 最后一条边连接回第一个顶点
            // }
            // const edgeKey = `Edge(${startVertexIndex}, ${endVertexIndex})`;
            // const edgeValue = { start: vertices[startVertexIndex], end: vertices[endVertexIndex], overlapCount: 0 };
            // HexagonLine.edgeMap.set(edgeKey, edgeValue);

                // recordOverlapCount(startVertexIndex, endVertexIndex){
    //     // 进行边的比较，记录重叠次数
    //     HexagonLine.edgeMap.forEach((edge1, key1) => {
    //         HexagonLine.edgeMap.forEach((edge2, key2) => {
    //         if (key1 !== key2 && this.checkOverlap(edge1, edge2)) {
    //             edge1.overlapCount++;
    //         }
    //         });
    //     });
    // }

    // checkOverlap(edge1, edge2) {
    //     // 这里实现检查边重叠的逻辑，根据你的需求进行具体判断
    //     // 返回 true 表示重叠，返回 false 表示不重叠
    //     // 可以使用边的起点和终点坐标进行计算
    //     // 例如，可以使用线段相交的算法来判断两条线段是否相交
    //     // 这里仅作示例，具体实现需要根据你的场景来确定
    //     return false;
    // }