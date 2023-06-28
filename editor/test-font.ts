const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const iconSize = 16; // 图标大小（像素）
const padding = 4; // 按钮内边距（像素）

// 加载字体文件
const font = new FontFace("FontAwesome", "url(webfonts/fa-solid-900.woff2)");
font.load()
    .then(() => {
        document.fonts.add(font);
        // 在字体加载完成后绘制按钮
        drawButtons();
    })
    .catch((error) => {
        console.error("Failed to load font:", error);
    });

// 设置字体样式
ctx.font = `${iconSize}px FontAwesome`;

// 绘制按钮函数
function drawButton(x, y, text, iconUnicode) {
    const buttonWidth = ctx.measureText(text).width + iconSize + padding * 3;

    // 绘制按钮背景
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, buttonWidth, iconSize + padding * 2);

    // 绘制图标
    ctx.fillStyle = "white";
    ctx.fillText(iconUnicode, x + padding, y + iconSize + padding);

    // 绘制文本
    ctx.fillText(text, x + iconSize + padding * 2, y + iconSize + padding);
}

// 绘制按钮
function drawButtons() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制最小化按钮
    drawButton(10, 10, "Minimize", "\uf068");

    // 绘制最大化按钮
    drawButton(10, 40, "Maximize", "\uf2d0");

    // 绘制关闭按钮
    drawButton(10, 70, "Close", "\uf00d");
}
