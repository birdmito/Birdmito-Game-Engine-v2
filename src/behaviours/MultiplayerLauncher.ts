import { GameObject } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { GameProcess } from "./GameProcess";

export interface RoomInfo {
    roomId: string;
    roomName: string;
    playerCount: number;
    maxPlayers: number;
    gameMode: string;
    status: 'waiting' | 'playing' | 'finished';
    players: { playerId: string, playerName: string, isReady: boolean }[];
}

export class MultiplayerLauncher extends Behaviour {
    private serverUrl: string = 'ws://localhost:3000';
    private httpUrl: string = 'http://localhost:3000';
    private availableRooms: RoomInfo[] = [];
    private currentRoom: RoomInfo | null = null;

    // UI回调函数
    onRoomsUpdated: (rooms: RoomInfo[]) => void = () => { };
    onRoomJoined: (room: RoomInfo) => void = () => { };
    onGameStart: () => void = () => { };

    async getRoomList(): Promise<RoomInfo[]> {
        try {
            const response = await fetch(`${this.httpUrl}/api/rooms`);
            const rooms = await response.json();
            this.availableRooms = rooms;
            this.onRoomsUpdated(rooms);
            return rooms;
        } catch (error) {
            console.error('获取房间列表失败:', error);
            return [];
        }
    }

    async createRoom(roomName: string, maxPlayers: number = 4): Promise<boolean> {
        try {
            const response = await fetch(`${this.httpUrl}/api/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roomName,
                    maxPlayers,
                    gameMode: 'civilization'
                })
            });

            if (response.ok) {
                const room = await response.json();
                await this.joinRoom(room.roomId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('创建房间失败:', error);
            return false;
        }
    }

    async joinRoom(roomId: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.httpUrl}/api/rooms/${roomId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerName: this.getPlayerName()
                })
            });

            if (response.ok) {
                const room = await response.json();
                this.currentRoom = room;
                this.onRoomJoined(room);

                // 连接到房间的WebSocket
                await this.connectToRoom(roomId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('加入房间失败:', error);
            return false;
        }
    }

    private async connectToRoom(roomId: string) {
        // 设置网络管理器的房间ID
        if (GameProcess.networkManager) {
            GameProcess.networkManager.setRoomId(roomId);
            await GameProcess.networkManager.connect();
        }
    }

    async leaveRoom(): Promise<void> {
        if (!this.currentRoom) return;

        try {
            await fetch(`${this.httpUrl}/api/rooms/${this.currentRoom.roomId}/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerId: this.getPlayerId()
                })
            });

            this.currentRoom = null;
            if (GameProcess.networkManager) {
                GameProcess.networkManager.disconnect();
            }
        } catch (error) {
            console.error('离开房间失败:', error);
        }
    }

    async setReady(ready: boolean): Promise<void> {
        if (!this.currentRoom) return;

        try {
            await fetch(`${this.httpUrl}/api/rooms/${this.currentRoom.roomId}/ready`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerId: this.getPlayerId(),
                    ready
                })
            });
        } catch (error) {
            console.error('设置准备状态失败:', error);
        }
    }

    startSinglePlayerGame(): void {
        // 启动单机游戏
        GameProcess.gameMode = 'PVE';
        GameProcess.isMultiplayer = false;

        // 创建游戏进程
        const gameProcessObject = new GameObject();
        const gameProcess = new GameProcess();
        gameProcessObject.addBehaviour(gameProcess);

        this.onGameStart();
    }

    private startMultiplayerGame(): void {
        // 启动联机游戏
        GameProcess.gameMode = 'multiplayer';
        GameProcess.isMultiplayer = true;

        // 创建游戏进程
        const gameProcessObject = new GameObject();
        const gameProcess = new GameProcess();
        gameProcessObject.addBehaviour(gameProcess);

        this.onGameStart();
    }

    private getPlayerName(): string {
        // 从本地存储或输入获取玩家名称
        return localStorage.getItem('playerName') || `Player_${Date.now()}`;
    }

    private getPlayerId(): string {
        // 从本地存储获取玩家ID
        let playerId = localStorage.getItem('playerId');
        if (!playerId) {
            playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('playerId', playerId);
        }
        return playerId;
    }

    getCurrentRoom(): RoomInfo | null {
        return this.currentRoom;
    }

    getAvailableRooms(): RoomInfo[] {
        return this.availableRooms;
    }

    // 处理来自网络管理器的房间事件
    handleRoomUpdate(room: RoomInfo): void {
        this.currentRoom = room;
        this.onRoomJoined(room);
    }

    handleGameStart(): void {
        console.log('游戏开始！');
        this.startMultiplayerGame();
    }
}
