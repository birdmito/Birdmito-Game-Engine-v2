const defaultSceneOrPrefab = "./assets/scenes/main.yaml";
// const defaultSceneOrPrefab = "./assets/prefabs/province.yaml";
// const defaultSceneOrPrefab = "./assets/scenes/gaming-scene.yaml";
const config = require("./config.json");
const { app, BrowserWindow, BrowserView, globalShortcut } = require("electron");
const { generateMainTs } = require("./main/generate-main");

async function startupCompiler() {
    const { createServer } = require("vite");
    const server = await createServer({
        // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
        configFile: false,
        root: __dirname,

        server: {
            port: 3000,
        },
    });
    await server.listen();

    server.printUrls();
}

let runtimeView;
let editorProcess;

async function startEditor() {
    const width = config.editor.hierarchy.width + config.editor.runtime.width + config.editor.inspector.width;
    const height =
        Math.max(
            config.editor.runtime.height,
            config.editor.hierarchy.height,
            config.editor.inspector.height
        ) + 200;
    function createWindow() {
        editorProcess = new BrowserWindow({
            width: width,   //
            height: height, //
            // frame: false,
            // resizable: false,    //
            fullscreenable: false, // 添加 fullscreenable 选项
            show: false, // 初始隐藏窗口以避免闪烁
            fullscreen: true,   //
            webPreferences: {
                nodeIntegration: true, //允许渲染进程使用Nodejs
                contextIsolation: false, //允许渲染进程使用Nodejs
            },
        });

        // 等待页面加载完成后显示窗口
        editorProcess.once("ready-to-show", () => {
            editorProcess.show();
        });

        editorProcess.maximize();
        editorProcess.loadURL("http://localhost:3000/editor.html");
        runtimeView = new BrowserView({
            webPreferences: {
                webSecurity: true,
                contextIsolation: true,
                nodeIntegration: false,
                allowRunningInsecureContent: false,
            },
        });
        editorProcess.addBrowserView(runtimeView);

        runtimeView.setBounds({
            x: config.editor.hierarchy.width,
            y: 0,
            width: config.editor.runtime.width,
            height: config.editor.runtime.height,
        });
        const mode = "edit";
        runtimeView.webContents.loadURL(
            `http://localhost:3000/index.html?mode=${mode}&prefab=${encodeURIComponent(defaultSceneOrPrefab)}`
        );
        globalShortcut.register("Alt+B", function () {
            runtimeView.webContents.openDevTools();
        });

    }

    app.whenReady().then(() => {
        createWindow();
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) createRuntimeProcess();
        });
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
}

function generateAssetsYaml() {
    const fs = require("fs");
    const imageIncludes = ["./assets/images", "./assets/animations"];
    const imageFiles = imageIncludes.flatMap((item) => fs.readdirSync(item).map((file) => item + "/" + file));
    const imageAssets = imageFiles.filter((item) => item.includes(".jpg") || item.includes(".png"));

    const textIncludes = ["./assets/prefabs", "./assets/animations", "./assets/scenes"];
    const textFiles = textIncludes.flatMap((item) => fs.readdirSync(item).map((file) => item + "/" + file));
    const prefabAssets = textFiles.filter((item) => item.includes(".yaml"));

    const content =
        "images:\n" +
        imageAssets.map((item) => "  - " + item).join("\n") +
        "\n" +
        "texts:\n" +
        prefabAssets.map((item) => "  - " + item).join("\n");
    fs.writeFileSync("./assets/assets.yaml", content, "utf-8");
}

async function startup() {
    generateMainTs();
    generateAssetsYaml();
    new WebSocketProxy().start();
    await startupCompiler();
    await startEditor();
}

class WebSocketProxy {
    editorClient;
    runtimeClient;

    start() {
        const { Server } = require("ws");
        const wss = new Server({ port: 1234 });
        wss.on("connection", (client) => {
            client.on("message", (text) => {
                const message = JSON.parse(text);
                if (message.command === "login") {
                    this.handleLogin(message, client);
                } else if (message.command === "changeMode") {
                    this.handleChangeMode(message);
                } else {
                    this.handleDispatchToOtherRendererProcess(message, text);
                }
            });
        });
    }

    handleChangeMode(message) {
        const mode = message.data;
        const url = `http://localhost:3000/index.html?mode=${mode}&prefab=${encodeURIComponent(
            defaultSceneOrPrefab
        )}`;
        if (mode === "play") {
            const player = new BrowserWindow({
                width: config.player.width,
                height: config.player.height + 12,
                autoHideMenuBar: true,
                resizable: false,
                webPreferences: {
                    nodeIntegration: true, //允许渲染进程使用Nodejs
                    contextIsolation: false, //允许渲染进程使用Nodejs
                },
            });
            player.loadURL(url);
            player.webContents.openDevTools();
        } else {
            runtimeView.webContents.loadURL(url);
        }
    }

    handleLogin(data, client) {
        if (data.id === "editor") {
            this.editorClient = client;
        } else if (data.id === "runtime") {
            this.runtimeClient = client;
        }
        if (this.editorClient && this.runtimeClient) {
            const text = JSON.stringify({ command: "loginSuccess" });
            this.editorClient.send(text);
            this.runtimeClient.send(text);
        }
    }

    handleDispatchToOtherRendererProcess(data, text) {
        if (data.id === "editor") {
            this.runtimeClient.send(text);
        } else if (data.id === "runtime") {
            this.editorClient.send(text);
        }
    }
}

startup().catch((e) => {
    console.log(e);
});
