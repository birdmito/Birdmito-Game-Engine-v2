import {
    allComponents,
    provideFASTDesignSystem
} from "@microsoft/fast-components";
import config from '../config.json';
import { EditorHost } from "./EditorHost";
import { HierarchyTree } from "./HierarchyTree";
import { InspectorPanel } from "./InspectorPanel";
import { layout } from "./layout";
provideFASTDesignSystem().register(allComponents);


async function startup() {
    const editorHost = new EditorHost();
    const saveButton = document.getElementById("save-button")!;
    saveButton.onclick = async () => {
        const response = await editorHost.execute('getSceneSerializedData', null);
        console.log(response)
        const fs = require("fs");
        fs.writeFileSync(response.filePath, response.content);
        alert('保存成功')
    };

    let currentMode: 'preview' | 'edit' = 'edit'

    const playButton = document.getElementById('play-button')!;
    playButton.onclick = () => {
        editorHost.send({ command: "changeMode", data: "play" })
    }
    const editButton = document.getElementById('edit-button')!;
    editButton.innerText = currentMode === 'edit' ? '进入预览模式' : "返回编辑模式"
    editButton.onclick = () => {
        currentMode = currentMode === 'edit' ? 'preview' : 'edit';
        editButton.innerText = currentMode === 'edit' ? '进入预览模式' : "返回编辑模式"
        editorHost.send({ command: "changeMode", data: currentMode })
    }



    const inspector = new InspectorPanel(editorHost);
    const hierarchyTree = new HierarchyTree(editorHost, inspector)
    editorHost.onRuntimeReady = () => {
        hierarchyTree.updateView();
    }
    await editorHost.start();

    const runtimePanel = document.getElementById('runtime-panel')!;
    const runtimePanelLayout = {
        x: config.editor.hierarchy.width,
        y: 0,
        width: config.editor.runtime.width,
        height: config.editor.runtime.height
    }
    layout(runtimePanelLayout, runtimePanel)

    const assetPanel = document.getElementById('assets-panel')!;
    const assetPanelLayout = {
        x: 0,
        y: Math.max(config.editor.runtime.height, config.editor.hierarchy.height, config.editor.inspector.height),
        width: config.editor.hierarchy.width + config.editor.runtime.width + config.editor.inspector.width,
        height: 200
    }
    layout(assetPanelLayout, assetPanel)
}

startup();
