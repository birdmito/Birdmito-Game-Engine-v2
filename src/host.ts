export class RuntimeHost {
    ws: WebSocket;

    private commandsMap: { [commandName: string]: Function } = {};
    registerCommand(command: Function) {
        this.commandsMap[command.name] = command;
    }

    start() {
        const ws = new WebSocket("ws://localhost:1234");
        this.ws = ws;
        ws.onmessage = (event) => {
            const recievedData = JSON.parse(event.data);
            if (recievedData.commandId) {
                const command = this.commandsMap[recievedData.command];
                const result = command(recievedData.data);
                this.send({ data: result, commandId: recievedData.commandId })
            }
        }
        return new Promise<void>((resolve, reject) => {
            ws.onopen = () => {
                ws.send(
                    JSON.stringify({
                        command: "login",
                        id: "runtime",
                    })
                );
                resolve();
            };
        });
    }

    send(obj: any) {
        (obj as any).id = "runtime";
        this.ws.send(JSON.stringify(obj));
    }
}

