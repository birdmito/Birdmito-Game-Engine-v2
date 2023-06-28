import { ImGui as gui, ImGui_Impl as gui_impl } from "@zhobo63/imgui-ts";
import { LayoutNode } from "./layout";
function setupCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
}
let _main: Editor;

function _loop(time: number) {
    _main.loop(time);
    window.requestAnimationFrame(_loop);
}

function helloworld() {
    gui.Button("Text");
    gui.Text("Version " + gui.VERSION);
    gui.Text("Helloworld");
}

let text = "";
const sb = new gui.StringBuffer(100, text);
function input() {
    let inputComplete = false;
    gui.Button("\uF068");
    gui.Button("\uF2D0");

    gui.PushFont(font2);
    if (
        gui.InputText("中文", sb, 256, gui.InputTextFlags.EnterReturnsTrue, (input) => {
            console.log(input);
            return 1;
        })
    ) {
        // 当按下回车键时
        inputComplete = true;
    }
    gui.PopFont();

    if (gui.IsItemDeactivatedAfterEdit()) {
        // 当控件失去焦点并编辑完成后
        inputComplete = true;
    }

    if (inputComplete) {
        // 在输入完成后执行的操作
        // ...
    }
}

class Editor {
    constructor() {}

    prev_time!: number;
    text: gui.ImStringBuffer = new gui.ImStringBuffer(128, "whats up");
    text2: gui.ImStringBuffer = new gui.ImStringBuffer(128, "もじ/もんじ");
    text_area: gui.ImStringBuffer = new gui.ImStringBuffer(128, "whats up multiline");
    text_area2: gui.ImStringBuffer = new gui.ImStringBuffer(
        128,
        "觀自在菩薩，行深般若波羅蜜多時，\n照見五蘊皆空，度一切苦厄。"
    );
    first: boolean = true;
    v4: gui.Vec4 = new gui.Vec4();
    image_src: gui.ImStringBuffer = new gui.ImStringBuffer(128, "");
    textureCache: gui_impl.TextureCache = new gui_impl.TextureCache();
    image!: gui_impl.Texture;

    loop(time: number): void {
        if (gui_impl.is_contextlost) return;
        if (!gui_impl.any_pointerdown() && time - this.prev_time < 1000.0 / 30) {
            //return;
        }
        gui_impl.NewFrame(time);
        gui.NewFrame();

        gui.SetNextWindowSize(new gui.ImVec2(1000, 300));

        gui.Begin("Hello");
        // helloworld();
        input();

        gui.End();

        gui.EndFrame();
        gui.Render();

        gui_impl.ClearBuffer(new gui.ImVec4(0.25, 0.25, 0.25, 1));
        gui_impl.RenderDrawData(gui.GetDrawData());
    }
}

async function loadArrayBuffer(url: string) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
            resolve(xhr.response);
        };
        xhr.onerror = () => {
            reject(xhr.statusText);
        };
        xhr.send();
    });
}

async function setupIMGUI(canvas: HTMLCanvasElement) {
    // 加载字体文件
    const fontFace = new FontFace("FontAwesome", "url(webfonts/fa-solid-900.woff2)");
    await fontFace.load();
    document.fonts.add(fontFace);

    await gui.default();
    gui.CHECKVERSION();
    console.log("ImGui.CreateContext() VERSION=", gui.VERSION);

    gui.CreateContext();
    gui.StyleColorsDark();
    if (gui.isMobile.any()) {
        gui_impl.setCanvasScale(1);
        gui_impl.setFontScale(1.5);
    }

    const io: gui.IO = gui.GetIO();
    let font1 = io.Fonts.AddFontDefault();
    font1.FontName = "FontAwesome";
    // font.FontName = "sans-serif";
    font1.FontStyle = "bold";

    font2 = io.Fonts.AddFontDefault();
    font2.FontName = "sans-serif";
    font2.FontStyle = "bold";

    // const fontArrayBuffer = await loadArrayBuffer("webfonts/fa-solid-900.ttf");
    // io.Fonts.AddFontFromMemoryTTF(fontArrayBuffer, 12);
    //font.FontSize=32;
    //font.Ascent=2.5;
    gui_impl.Init(canvas);
}
let font2: any;
window.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    setupCanvas(canvas);
    await setupIMGUI(canvas);
    _main = new Editor();
    window.requestAnimationFrame(_loop);
});

const root = new LayoutNode(0, 0, true); // 根节点，初始宽度和高度为0，自动调整大小

const node1 = new LayoutNode(200, 100, false); // 节点1，宽度固定为200，高度固定为100，不自动调整大小
const node2 = new LayoutNode(0, 0, true); // 节点2，初始宽度和高度为0，自动调整大小
const node3 = new LayoutNode(0, 0, true); // 节点3，初始宽度和高度为0，自动调整大小

node1.addChild(node2);
node1.addChild(node3);

root.addChild(node1);

root.layout(window.screen.width, window.screen.height);

console.log(node1);
console.log(node2);
console.log(node3);
