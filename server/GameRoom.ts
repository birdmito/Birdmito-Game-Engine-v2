import { Player } from './Player';
import { GameState } from './GameState';
import { PlayerAction, ActionResult } from './types';

export class GameRoom {
    public id: string;
    public name: string;
    public maxPlayers: number;
    public players: Map<string, Player> = new Map();
    public gameState: GameState;
    public currentPlayer: string = '';
    public status: 'waiting' | 'playing' | 'finished' = 'waiting';
    public turnTimeLimit: number = 60000; // 60秒
    private turnTimer?: NodeJS.Timeout;

    constructor(name: string, maxPlayers: number = 4) {
        this.id = this.generateRoomId();
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.gameState = new GameState();
    }

    addPlayer(player: Player): boolean {
        if (this.isFull()) {
            return false;
        }

        this.players.set(player.id, player);

        // 分配国家ID
        const availableNations = this.getAvailableNations();
        if (availableNations.length > 0) {
            player.setNation(availableNations[0]);
        }

        // 如果房间满了，开始游戏
        if (this.isFull() && this.allPlayersReady()) {
            this.startGame();
        }

        return true;
    }

    removePlayer(playerId: string): boolean {
        const player = this.players.get(playerId);
        if (!player) return false;

        this.players.delete(playerId);

        // 如果是当前玩家离开，跳过他的回合
        if (this.currentPlayer === playerId) {
            this.nextTurn();
        }

        return true;
    }

    hasPlayer(playerId: string): boolean {
        return this.players.has(playerId);
    }

    isFull(): boolean {
        return this.players.size >= this.maxPlayers;
    }

    isEmpty(): boolean {
        return this.players.size === 0;
    }

    allPlayersReady(): boolean {
        return Array.from(this.players.values()).every(player => player.isReady);
    }

    broadcast(message: any, excludePlayerId?: string) {
        this.players.forEach((player, playerId) => {
            if (excludePlayerId && playerId === excludePlayerId) return;
            player.send(message);
        });
    }

    startGame() {
        this.status = 'playing';
        this.gameState.initialize(Array.from(this.players.keys()));

        // 随机选择第一个玩家
        const playerIds = Array.from(this.players.keys());
        this.currentPlayer = playerIds[Math.floor(Math.random() * playerIds.length)];

        this.broadcast({
            type: 'game_started',
            data: {
                currentPlayer: this.currentPlayer,
                gameState: this.gameState.serialize()
            }
        });

        this.startTurnTimer();
    }

    processPlayerAction(playerId: string, action: PlayerAction): ActionResult {
        // 验证行动是否合法
        const validation = this.gameState.validateAction(playerId, action);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // 执行行动
        const result = this.gameState.executeAction(playerId, action);

        if (result.success) {
            // 更新玩家最后行动时间
            const player = this.players.get(playerId);
            if (player) {
                player.updateLastAction();
            }
        }

        return result;
    }

    nextTurn() {
        this.clearTurnTimer();

        // 获取下一个玩家
        const playerIds = Array.from(this.players.keys());
        const currentIndex = playerIds.indexOf(this.currentPlayer);
        const nextIndex = (currentIndex + 1) % playerIds.length;
        this.currentPlayer = playerIds[nextIndex];

        // 检查游戏是否结束
        if (this.gameState.isGameOver()) {
            this.endGame();
            return;
        }

        this.broadcast({
            type: 'turn_changed',
            data: {
                currentPlayer: this.currentPlayer,
                gameState: this.gameState.serialize()
            }
        });

        this.startTurnTimer();
    }

    private startTurnTimer() {
        this.turnTimer = setTimeout(() => {
            // 时间到，强制结束回合
            this.broadcast({
                type: 'turn_timeout',
                data: { playerId: this.currentPlayer }
            });
            this.nextTurn();
        }, this.turnTimeLimit);
    }

    private clearTurnTimer() {
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = undefined;
        }
    }

    private endGame() {
        this.status = 'finished';
        this.clearTurnTimer();

        const winner = this.gameState.getWinner();
        this.broadcast({
            type: 'game_ended',
            data: { winner }
        });
    }

    private getAvailableNations(): number[] {
        const usedNations = Array.from(this.players.values()).map(p => p.nationId);
        const allNations = [1, 2, 3, 4, 5, 6]; // 假设最多6个国家
        return allNations.filter(id => !usedNations.includes(id));
    }

    getGameState() {
        return this.gameState.serialize();
    }

    private generateRoomId(): string {
        return 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}
