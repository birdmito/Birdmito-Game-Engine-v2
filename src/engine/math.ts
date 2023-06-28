import { Matrix } from "../engine";


/**
 * 
 * 矩阵与矩阵相乘
 * 扩展阅读：矩阵乘法的几何意义是什么？ 
 * https://www.zhihu.com/question/21351965/answer/204058188
 */
export function matrixAppendMatrix(m1: Matrix, m2: Matrix) {

    const result = new Matrix();
    result.a = m1.a * m2.a + m1.b * m2.c;
    result.b = m1.a * m2.b + m1.b * m2.d;
    result.c = m2.a * m1.c + m2.c * m1.d;
    result.d = m2.b * m1.c + m1.d * m2.d;
    result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
    result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
    return result;
}

export type Point = {
    x: number,
    y: number
}

export type Rectangle = {
    x: number, y: number, width: number, height: number
}

export function checkPointInRectangle(point: Point, rectangle: Rectangle) {
    return (
        point.x >= rectangle.x &&
        point.x <= rectangle.x + rectangle.width &&
        point.y >= rectangle.y &&
        point.y <= rectangle.y + rectangle.height
    )
}




/**
 * 
 * 向量与矩阵相乘
 * 其几何意义是：
 * 把一个点的坐标（向量）进行一个空间变换（矩阵），得到一个新的坐标（向量）
 */
export function pointAppendMatrix(point: Point, m: Matrix) {
    const x = m.a * point.x + m.c * point.y + m.tx;
    const y = m.b * point.x + m.d * point.y + m.ty;
    return { x, y }

}


/**
 * 使用伴随矩阵法求逆矩阵
 * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
 */
export function invertMatrix(m: Matrix) {
    let a = m.a;
    let b = m.b;
    let c = m.c;
    let d = m.d;
    let tx = m.tx;
    let ty = m.ty;
    let determinant = a * d - b * c;
    const result = new Matrix(1, 0, 0, 1, 0, 0);
    if (determinant == 0) {
        throw new Error("no invert");
    }

    determinant = 1 / determinant;
    const k = result.a = d * determinant;
    b = result.b = -b * determinant;
    c = result.c = -c * determinant;
    d = result.d = a * determinant;
    result.tx = -(k * tx + c * ty);
    result.ty = -(b * tx + d * ty);
    return result;

}