import { GameObject } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { MultiplayerLauncher, RoomInfo } from "./MultiplayerLauncher";
import { GameProcess } from "./GameProcess";

export class MainMenu extends Behaviour {
    private multiplayerLauncher: MultiplayerLauncher;
    private currentScreen: 'main' | 'multiplayer' | 'room' = 'main';
    private availableRooms: RoomInfo[] = [];
    private currentRoom: RoomInfo | null = null;

    constructor() {
        super();
        this.initializeMultiplayerLauncher();
    }

    onStart(): void {
        console.log('主菜单已启动');
        this.showMainMenu();
    }

    private initializeMultiplayerLauncher(): void {
        // 创建联机启动器
        const launcherObject = new GameObject();
        this.multiplayerLauncher = new MultiplayerLauncher();
        launcherObject.addBehaviour(this.multiplayerLauncher);

        // 设置回调函数
        this.multiplayerLauncher.onRoomsUpdated = (rooms) => {
            this.availableRooms = rooms;
            this.updateRoomList();
        };

        this.multiplayerLauncher.onRoomJoined = (room) => {
            this.currentRoom = room;
            this.showRoomScreen();
        };

        this.multiplayerLauncher.onGameStart = () => {
            this.hideMenu();
        };
    }

    // 显示主菜单
    private showMainMenu(): void {
        this.currentScreen = 'main';
        console.log('显示主菜单');

        // 这里可以添加实际的UI渲染代码
        // 创建菜单按钮等
        this.createMainMenuUI();
    }

    // 创建主菜单UI
    private createMainMenuUI(): void {
        // 模拟创建UI元素
        console.log('创建主菜单UI:');
        console.log('1. 单人游戏');
        console.log('2. 多人游戏');
        console.log('3. 设置');
        console.log('4. 退出');

        // 在实际实现中，这里会创建真正的UI组件
        // 例如使用游戏引擎的UI系统
    }

    // 显示多人游戏菜单
    private showMultiplayerMenu(): void {
        this.currentScreen = 'multiplayer';
        console.log('显示多人游戏菜单');

        // 获取房间列表
        this.multiplayerLauncher.getRoomList();

        this.createMultiplayerMenuUI();
    }

    // 创建多人游戏菜单UI
    private createMultiplayerMenuUI(): void {
        console.log('创建多人游戏菜单UI:');
        console.log('1. 创建房间');
        console.log('2. 加入房间');
        console.log('3. 刷新房间列表');
        console.log('4. 返回主菜单');

        this.updateRoomList();
    }

    // 更新房间列表显示
    private updateRoomList(): void {
        if (this.currentScreen === 'multiplayer') {
            console.log('\n可用房间:');
            if (this.availableRooms.length === 0) {
                console.log('暂无可用房间');
            } else {
                this.availableRooms.forEach((room, index) => {
                    console.log(`${index + 1}. ${room.roomName} (${room.playerCount}/${room.maxPlayers}) - ${room.status}`);
                });
            }
        }
    }

    // 显示房间界面
    private showRoomScreen(): void {
        this.currentScreen = 'room';
        console.log('显示房间界面');

        if (this.currentRoom) {
            console.log(`房间: ${this.currentRoom.roomName}`);
            console.log(`玩家: ${this.currentRoom.playerCount}/${this.currentRoom.maxPlayers}`);
            console.log('玩家列表:');

            this.currentRoom.players.forEach((player, index) => {
                const readyStatus = player.isReady ? '✓' : '✗';
                console.log(`${index + 1}. ${player.playerName} ${readyStatus}`);
            });

            console.log('\n1. 准备/取消准备');
            console.log('2. 离开房间');
        }
    }

    // 隐藏菜单（游戏开始时）
    private hideMenu(): void {
        console.log('隐藏菜单，游戏开始');
        // 这里可以添加隐藏UI的代码
    }

    // 菜单事件处理
    handleMenuAction(action: string, data?: any): void {
        switch (this.currentScreen) {
            case 'main':
                this.handleMainMenuAction(action, data);
                break;
            case 'multiplayer':
                this.handleMultiplayerMenuAction(action, data);
                break;
            case 'room':
                this.handleRoomAction(action, data);
                break;
        }
    }

    // 处理主菜单行动
    private handleMainMenuAction(action: string, data?: any): void {
        switch (action) {
            case 'single_player':
                console.log('启动单人游戏');
                this.multiplayerLauncher.startSinglePlayerGame();
                break;

            case 'multiplayer':
                console.log('进入多人游戏菜单');
                this.showMultiplayerMenu();
                break;

            case 'settings':
                console.log('打开设置');
                // 显示设置界面
                break;

            case 'exit':
                console.log('退出游戏');
                // 退出游戏逻辑
                break;

            default:
                console.log('未知主菜单行动:', action);
        }
    }

    // 处理多人游戏菜单行动
    private handleMultiplayerMenuAction(action: string, data?: any): void {
        switch (action) {
            case 'create_room':
                const roomName = data?.roomName || `房间_${Date.now()}`;
                const maxPlayers = data?.maxPlayers || 4;
                console.log(`创建房间: ${roomName}`);
                this.multiplayerLauncher.createRoom(roomName, maxPlayers);
                break;

            case 'join_room':
                if (data?.roomId) {
                    console.log(`加入房间: ${data.roomId}`);
                    this.multiplayerLauncher.joinRoom(data.roomId);
                }
                break;

            case 'refresh_rooms':
                console.log('刷新房间列表');
                this.multiplayerLauncher.getRoomList();
                break;

            case 'back':
                console.log('返回主菜单');
                this.showMainMenu();
                break;

            default:
                console.log('未知多人游戏菜单行动:', action);
        }
    }

    // 处理房间行动
    private handleRoomAction(action: string, data?: any): void {
        switch (action) {
            case 'toggle_ready':
                const isReady = data?.ready !== undefined ? data.ready : true;
                console.log(`设置准备状态: ${isReady}`);
                this.multiplayerLauncher.setReady(isReady);
                break;

            case 'leave_room':
                console.log('离开房间');
                this.multiplayerLauncher.leaveRoom();
                this.currentRoom = null;
                this.showMultiplayerMenu();
                break;

            default:
                console.log('未知房间行动:', action);
        }
    }

    // 获取当前菜单状态
    getCurrentScreen(): string {
        return this.currentScreen;
    }

    // 获取可用房间列表
    getAvailableRooms(): RoomInfo[] {
        return this.availableRooms;
    }

    // 获取当前房间信息
    getCurrentRoom(): RoomInfo | null {
        return this.currentRoom;
    }

    // 模拟键盘输入处理（实际实现中应该通过事件系统）
    onKeyPress(key: string): void {
        switch (this.currentScreen) {
            case 'main':
                switch (key) {
                    case '1':
                        this.handleMenuAction('single_player');
                        break;
                    case '2':
                        this.handleMenuAction('multiplayer');
                        break;
                    case '3':
                        this.handleMenuAction('settings');
                        break;
                    case '4':
                        this.handleMenuAction('exit');
                        break;
                }
                break;

            case 'multiplayer':
                switch (key) {
                    case '1':
                        this.handleMenuAction('create_room', { roomName: '新房间', maxPlayers: 4 });
                        break;
                    case '2':
                        // 这里应该显示房间选择对话框
                        if (this.availableRooms.length > 0) {
                            this.handleMenuAction('join_room', { roomId: this.availableRooms[0].roomId });
                        }
                        break;
                    case '3':
                        this.handleMenuAction('refresh_rooms');
                        break;
                    case '4':
                        this.handleMenuAction('back');
                        break;
                }
                break;

            case 'room':
                switch (key) {
                    case '1':
                        this.handleMenuAction('toggle_ready', { ready: true });
                        break;
                    case '2':
                        this.handleMenuAction('leave_room');
                        break;
                }
                break;
        }
    }
}
