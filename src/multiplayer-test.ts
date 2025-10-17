import { GameObject } from "./engine";
import { MainMenu } from "./behaviours/MainMenu";

console.log('=== 文明游戏 - 多人版本 ===');
console.log('启动游戏菜单...');

// 创建主菜单
const menuObject = new GameObject();
const mainMenu = new MainMenu();
menuObject.addBehaviour(mainMenu);

// 模拟用户交互（实际实现中应该通过UI事件）
console.log('\n请选择游戏模式:');
console.log('按 1 开始单人游戏');
console.log('按 2 进入多人游戏');
console.log('按 3 查看设置');
console.log('按 4 退出游戏');

// 导出主菜单供外部使用
export { mainMenu };

// 添加一些测试函数
export function testSinglePlayer() {
    console.log('\n=== 测试单人游戏 ===');
    mainMenu.handleMenuAction('single_player');
}

export function testMultiplayer() {
    console.log('\n=== 测试多人游戏 ===');
    mainMenu.handleMenuAction('multiplayer');
}

export function testCreateRoom() {
    console.log('\n=== 测试创建房间 ===');
    mainMenu.handleMenuAction('multiplayer');
    setTimeout(() => {
        mainMenu.handleMenuAction('create_room', {
            roomName: '测试房间',
            maxPlayers: 4
        });
    }, 1000);
}

// 如果直接运行此文件，显示菜单
if (require.main === module) {
    console.log('\n游戏已启动，等待用户操作...');

    // 模拟自动测试（可选）
    setTimeout(() => {
        console.log('\n自动测试多人游戏功能...');
        testCreateRoom();
    }, 2000);
}
