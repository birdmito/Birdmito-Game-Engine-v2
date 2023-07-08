export class ResourceManager {
    textCache: { [url: string]: string } = {};
    imageCache: { [url: string]: HTMLImageElement } = {};
    audioCache: { [url: string]: HTMLAudioElement } = {};

    loadImage(url: string) {
        return new Promise<void>((resolve, reject) => {
            const img = document.createElement("img");
            img.src = url;
            img.onload = () => {
                this.imageCache[url] = img;
                resolve();
            };
        });
    }

    loadText(url: string) {
        return new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("get", url);
            xhr.send();
            xhr.onload = () => {
                this.textCache[url] = xhr.responseText;
                resolve();
            };
        });
    }

    loadAudio(url: string) {
        return new Promise<void>((resolve, reject) => {
            const audio = new Audio(url);
            audio.onloadedmetadata = () => {
                this.audioCache[url] = audio;
                resolve();
            };
        });
    }

    getText(url: string) {
        const text = this.textCache[url];
        if (!text) {
            console.log(Object.keys(this.textCache));
            alert("配置文件加载失败" + url);
        }
        return text;
    }

    getImage(url: string) {
        const image = this.imageCache[url];
        if (!image) {
            alert("图片加载失败" + url);
        }
        return image;
    }

    getAudio(url: string) {
        const audio = this.audioCache[url];
        if (!audio) {
            alert("音频加载失败" + url);
        }
        return audio;
    }
}
