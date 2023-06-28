export function layout(
    layoutData: { x: number; y: number; width: number; height: number },
    div: HTMLElement
) {
    div.style.top = layoutData.y + "px";
    div.style.left = layoutData.x + "px";
    div.style.width = layoutData.width + "px";
    div.style.height = layoutData.height + "px";
}

export class LayoutNode {
    width: number;
    height: number;
    autoSize: boolean;
    left: number;
    right: number;
    top: number;
    bottom: number;
    children: LayoutNode[];
    constructor(width: number, height: number, autoSize: boolean) {
        this.width = width;
        this.height = height;
        this.autoSize = autoSize;
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
        this.children = [];
    }

    addChild(childNode: LayoutNode) {
        this.children.push(childNode);
    }

    layout(parentWidth, parentHeight) {
        let totalAutoSizeNodes = 0;
        let fixedWidthSum = 0;
        let fixedHeightSum = 0;

        this.children.forEach((childNode) => {
            if (childNode.autoSize) {
                totalAutoSizeNodes++;
            } else {
                fixedWidthSum += childNode.width;
                fixedHeightSum += childNode.height;
            }
        });

        const autoSizeWidth = totalAutoSizeNodes > 0 ? (parentWidth - fixedWidthSum) / totalAutoSizeNodes : 0;
        const autoSizeHeight =
            totalAutoSizeNodes > 0 ? (parentHeight - fixedHeightSum) / totalAutoSizeNodes : 0;

        let x = 0;
        let y = 0;

        this.children.forEach((childNode) => {
            childNode.left = x;
            childNode.top = y;

            if (childNode.autoSize) {
                childNode.width = autoSizeWidth;
                childNode.height = autoSizeHeight;
            }

            childNode.layout(childNode.width, childNode.height);

            x += childNode.width;
            y += childNode.height;
        });
    }
}

// const root = new LayoutNode(0, 0, true); // 根节点，初始宽度和高度为0，自动调整大小

// const node1 = new LayoutNode(200, 100, false); // 节点1，宽度固定为200，高度固定为100，不自动调整大小
// const node2 = new LayoutNode(0, 0, true); // 节点2，初始宽度和高度为0，自动调整大小
// const node3 = new LayoutNode(0, 0, true); // 节点3，初始宽度和高度为0，自动调整大小

// node1.addChild(node2);
// node1.addChild(node3);

// root.addChild(node1);

// root.layout(window.innerWidth, window.innerHeight);

// console.log(node1);
// console.log(node2);
// console.log(node3);
