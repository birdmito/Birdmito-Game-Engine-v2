import WebSocket from 'ws';
import { createServer } from 'http';
import express from 'express';
import { GameRoom } from './GameRoom';
import { Player } from './Player';

export class GameServer {
    private wss: WebSocket.Server;
    private app: express.Application;
    private server: any;
    private gameRooms: Map<string, GameRoom> = new Map();
    private players: Map<string, Player> = new Map();

    constructor(port: number = 8080) {
        this.app = express();
        this.server = createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });

        this.setupRoutes();
        this.setupWebSocket();

        this.server.listen(port, () => {
            console.log(`游戏服务器启动，端口: ${port}`);
        });
    }

    private setupRoutes() {
        this.app.use(express.json());

        // 获取房间列表
        this.app.get('/api/rooms', (req, res) => {
            const rooms = Array.from(this.gameRooms.values()).map(room => ({
                id: room.id,
                name: room.name,
                playerCount: room.players.size,
                maxPlayers: room.maxPlayers,
                status: room.status
            }));
            res.json(rooms);
        });

        // 创建房间
        this.app.post('/api/rooms', (req, res) => {
            const { name, maxPlayers = 4 } = req.body;
            const room = new GameRoom(name, maxPlayers);
            this.gameRooms.set(room.id, room);
            res.json({ roomId: room.id });
        });
    }

    private setupWebSocket() {
        this.wss.on('connection', (ws: WebSocket, req) => {
            console.log('新客户端连接');

            ws.on('message', (data: string) => {
                try {
                    const message = JSON.parse(data);
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.error('消息解析错误:', error);
                    ws.send(JSON.stringify({ type: 'error', message: '无效的消息格式' }));
                }
            });

            ws.on('close', () => {
                this.handleDisconnection(ws);
            });

            ws.on('error', (error) => {
                console.error('WebSocket错误:', error);
            });
        });
    }

    private handleMessage(ws: WebSocket, message: any) {
        const { type, data } = message;

        switch (type) {
            case 'join_room':
                this.handleJoinRoom(ws, data);
                break;
            case 'player_action':
                this.handlePlayerAction(ws, data);
                break;
            case 'leave_room':
                this.handleLeaveRoom(ws, data);
                break;
            default:
                console.log('未知消息类型:', type);
        }
    }

    private handleJoinRoom(ws: WebSocket, data: { roomId: string, playerName: string }) {
        const { roomId, playerName } = data;
        const room = this.gameRooms.get(roomId);

        if (!room) {
            ws.send(JSON.stringify({ type: 'error', message: '房间不存在' }));
            return;
        }

        if (room.isFull()) {
            ws.send(JSON.stringify({ type: 'error', message: '房间已满' }));
            return;
        }

        const player = new Player(this.generatePlayerId(), playerName, ws);
        this.players.set(player.id, player);
        room.addPlayer(player);

        // 通知玩家加入成功
        ws.send(JSON.stringify({
            type: 'joined_room',
            data: {
                playerId: player.id,
                roomId: room.id,
                gameState: room.getGameState()
            }
        }));

        // 通知房间内其他玩家
        room.broadcast({
            type: 'player_joined',
            data: { playerName, playerId: player.id }
        }, player.id);
    }

    private handlePlayerAction(ws: WebSocket, data: any) {
        const player = this.findPlayerByConnection(ws);
        if (!player) return;

        const room = this.findRoomByPlayer(player.id);
        if (!room) return;

        // 验证轮次
        if (room.currentPlayer !== player.id) {
            ws.send(JSON.stringify({ type: 'error', message: '不是你的回合' }));
            return;
        }

        // 处理玩家行动
        const result = room.processPlayerAction(player.id, data);

        if (result.success) {
            // 广播行动结果
            room.broadcast({
                type: 'action_result',
                data: result
            });

            // 切换到下一个玩家
            room.nextTurn();
        } else {
            ws.send(JSON.stringify({ type: 'error', message: result.error }));
        }
    }

    private handleLeaveRoom(ws: WebSocket, data: any) {
        const player = this.findPlayerByConnection(ws);
        if (!player) return;

        const room = this.findRoomByPlayer(player.id);
        if (room) {
            room.removePlayer(player.id);
            room.broadcast({
                type: 'player_left',
                data: { playerName: player.name, playerId: player.id }
            });

            if (room.isEmpty()) {
                this.gameRooms.delete(room.id);
            }
        }

        this.players.delete(player.id);
    }

    private handleDisconnection(ws: WebSocket) {
        const player = this.findPlayerByConnection(ws);
        if (player) {
            console.log(`玩家 ${player.name} 断开连接`);
            this.handleLeaveRoom(ws, {});
        }
    }

    private findPlayerByConnection(ws: WebSocket): Player | undefined {
        return Array.from(this.players.values()).find(player => player.connection === ws);
    }

    private findRoomByPlayer(playerId: string): GameRoom | undefined {
        return Array.from(this.gameRooms.values()).find(room => room.hasPlayer(playerId));
    }

    private generatePlayerId(): string {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// 启动服务器
if (require.main === module) {
    new GameServer(8080);
}
