export class EditorHost {
    ws: WebSocket;

    private commandPool: { [id: string]: any; } = {};

    onRuntimeReady: () => void

    start() {
        const ws = new WebSocket("ws://localhost:1234");
        this.ws = ws;

        return new Promise<void>((resolve, reject) => {
            ws.onmessage = (event) => {
                const recievedData = JSON.parse(event.data);
                if (recievedData.commandId) {
                    const requestCommand = this.commandPool[recievedData.commandId];
                    delete this.commandPool[recievedData.commandId];
                    const response = recievedData.data;
                    requestCommand.callback(response);
                }
                if (recievedData.command === 'loginSuccess') {
                    this.onRuntimeReady()
                    resolve();
                }
            };

            ws.onopen = () => {
                ws.send(
                    JSON.stringify({
                        command: "login",
                        id: "editor",
                    })
                );
            };
        });
    }

    send(data: any) {
        data.id = "editor";
        this.ws.send(JSON.stringify(data));
    }

    execute(type: string, param: any) {
        return new Promise<any>((resolve, reject) => {
            commandUUID++;
            const command = { command: type, data: param, commandId: commandUUID, callback: resolve };
            this.commandPool[commandUUID] = command;
            this.send(command);
        });

    }
}

let commandUUID = 0;