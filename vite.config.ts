/// <reference types="vitest" />
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const mode = "play";
const defaultSceneOrPrefab = "./assets/scenes/main.yaml";
const url = `/index.html?mode=${mode}&prefab=${encodeURIComponent(defaultSceneOrPrefab)}`;
export default defineConfig({
    server: {
        open: url,
    },
    test: {},
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: "assets",
                    dest: ".",
                },
            ],
        }),
    ],
    build: {
        minify: false,
        outDir: "./game-release/dist",
    },
});
