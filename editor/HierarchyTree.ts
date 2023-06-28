import { TreeItem, TreeView } from "@microsoft/fast-components";
import config from '../config.json'
import type { GameObjectInfo } from '../src/types';
import { EditorHost } from "./EditorHost";
import { InspectorPanel } from "./InspectorPanel";
import { layout } from "./layout";

export class HierarchyTree {

    private treeNode: TreeView
    constructor(private editorHost: EditorHost, private inspectorPanel: InspectorPanel) {
        this.treeNode = document.getElementById('hierarchy-tree') as TreeView;
        const panel = document.getElementById('hierarchy-panel') as HTMLElement;
        const layoutData = {
            x: 0, y: 0, width: config.editor.hierarchy.width, height: config.editor.hierarchy.height
        }
        layout(layoutData, panel)
    }

    async updateView() {
        this.treeNode.innerHTML = ''
        const gameObjects = await this.editorHost.execute('getAllGameObjects', null);
        const inspectorPanel = this.inspectorPanel;
        function createTreeItem(container: HTMLElement, info: GameObjectInfo) {
            const treeItem = new TreeItem();
            treeItem.addEventListener('click', (e) => {
                console.log('点击了' + info.name, info.uuid)
                inspectorPanel.onSelectGameObject(info.uuid);
                e.stopPropagation();
            })
            treeItem.innerText = info.name;
            container.appendChild(treeItem);
            const gameObjectChildren = info.children || [];
            for (const child of gameObjectChildren) {
                createTreeItem(treeItem, child)
            }
        }

        for (const gameObject of gameObjects) {
            createTreeItem(this.treeNode, gameObject);
        }
    }
}

