import WebSocket from 'ws';

export class Player {
    public id: string;
    public name: string;
    public connection: WebSocket;
    public nationId: number = 0;
    public isReady: boolean = false;
    public lastActionTime: number = Date.now();

    constructor(id: string, name: string, connection: WebSocket) {
        this.id = id;
        this.name = name;
        this.connection = connection;
    }

    send(message: any) {
        if (this.connection.readyState === WebSocket.OPEN) {
            this.connection.send(JSON.stringify(message));
        }
    }

    setNation(nationId: number) {
        this.nationId = nationId;
    }

    setReady(ready: boolean) {
        this.isReady = ready;
    }

    updateLastAction() {
        this.lastActionTime = Date.now();
    }

    isConnected(): boolean {
        return this.connection.readyState === WebSocket.OPEN;
    }
}
