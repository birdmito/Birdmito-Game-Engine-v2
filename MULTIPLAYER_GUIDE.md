# 文明游戏 - 多人模式设置指南

## 概述

已成功为您的文明游戏添加了多人联机功能！现在支持通过 WebSocket 进行实时多人游戏。

## 架构说明

### 客户端 (Client)

-   `NetworkManager.ts` - 网络通信管理器
-   `MultiplayerLauncher.ts` - 多人游戏启动器
-   `MainMenu.ts` - 主菜单系统
-   `GameProcess.ts` - 游戏进程（已增加多人支持）

### 服务器 (Server)

-   `server/server.ts` - 主服务器
-   `server/GameRoom.ts` - 游戏房间管理
-   `server/Player.ts` - 玩家管理
-   `server/GameState.ts` - 服务器端游戏状态
-   `server/types.ts` - 类型定义

## 安装和运行

### 1. 安装服务器依赖

```bash
cd server
npm install
```

### 2. 启动服务器

```bash
# 开发模式
npm run dev

# 或者编译后运行
npm run build
npm start
```

### 3. 启动客户端

在主项目目录：

```bash
npm run dev
```

## 功能特性

### ✅ 已实现

-   WebSocket 实时通信
-   房间创建和管理
-   玩家加入/离开
-   游戏状态同步基础架构
-   回合制多人支持
-   断线重连机制

### 🔄 部分完成

-   游戏状态同步（需要与现有游戏逻辑集成）
-   玩家行动验证
-   UI 界面（目前是控制台输出）

### 📋 待完成

-   完整的游戏状态同步
-   UI 界面实现
-   观战者模式
-   游戏录制回放

## 使用方法

### 单人游戏

```typescript
import { mainMenu } from "./src/multiplayer-test";
mainMenu.handleMenuAction("single_player");
```

### 多人游戏

1. 启动服务器
2. 启动客户端
3. 选择多人游戏
4. 创建或加入房间
5. 等待其他玩家
6. 开始游戏

## 网络协议

### 消息类型

-   `player_joined` - 玩家加入
-   `player_left` - 玩家离开
-   `game_state_update` - 游戏状态更新
-   `game_start` - 游戏开始
-   `turn_change` - 回合变化
-   `game_action` - 游戏行动

### 游戏行动类型

-   `move_unit` - 移动单位
-   `build_structure` - 建造建筑
-   `research_tech` - 研究科技
-   `attack` - 攻击
-   `colonize` - 殖民
-   `end_turn` - 结束回合

## 配置选项

### 服务器配置

-   端口：3000 (HTTP) / 8080 (WebSocket)
-   最大房间数：无限制
-   每房间最大玩家数：4（可配置）

### 客户端配置

-   服务器地址：localhost:8080
-   重连次数：5 次
-   重连间隔：指数退避算法

## 测试

### 快速测试

```bash
# 编译TypeScript
npm run build

# 运行测试
node dist/src/multiplayer-test.js
```

### 本地多客户端测试

1. 启动服务器
2. 打开多个客户端实例
3. 创建房间并加入不同玩家
4. 测试游戏功能

## 故障排除

### 常见问题

**连接失败**

-   检查服务器是否已启动
-   确认端口未被占用
-   检查防火墙设置

**游戏状态不同步**

-   检查网络连接
-   查看控制台错误信息
-   确认所有玩家使用相同版本

**房间无法创建**

-   检查服务器日志
-   确认 HTTP API 正常工作
-   验证请求格式正确

## 下一步计划

1. **完善游戏状态同步**

    - 将 Nation.ts 和 Province.ts 与网络层集成
    - 实现完整的状态验证

2. **UI 界面实现**

    - 创建房间列表界面
    - 实现游戏内聊天
    - 添加玩家状态显示

3. **性能优化**

    - 实现增量状态同步
    - 添加数据压缩
    - 优化网络消息频率

4. **安全性增强**
    - 添加玩家认证
    - 实现反外挂机制
    - 加强输入验证

## 技术细节

### 状态同步策略

采用"权威服务器"模式，所有游戏逻辑在服务器端执行，客户端只负责显示和输入。

### 网络协议

使用 JSON 格式的 WebSocket 消息，支持心跳检测和自动重连。

### 回合制处理

服务器维护当前回合和玩家顺序，只允许当前玩家执行行动。

---

**恭喜！您的文明游戏现在支持多人联机了！** 🎉

如需帮助或有问题，请查看控制台日志或联系开发者。
