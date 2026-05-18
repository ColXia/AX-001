# 前端基座设计方案

## 目标

创建一个可扩展的前端基座，支持多种房间类型（Interview、Roleplay、未来其他类型），避免每种房间重复开发前端。

## 当前问题

1. **面试专用设计**：现有 `index.html` 和 `interview-demo.js` 是面试专用
2. **样式耦合**：`interview-demo.css` 包含面试特定样式
3. **房间类型硬编码**：`app.js` 中有面试特定的 UI 元素和逻辑
4. **缺乏房间类型抽象**：没有统一的房间类型接口

## 设计原则

1. **基座 + 插件**：基座提供通用功能，房间类型作为插件接入
2. **配置驱动**：房间类型的 UI 差异通过配置而非代码分支
3. **渐进增强**：基座支持基本功能，插件可扩展高级功能
4. **向后兼容**：现有面试功能平滑迁移

## 架构设计

### 1. 文件结构

```
web/chatroom/
├── index.html                    # 入口 HTML（基座）
├── base/
│   ├── base-app.js              # 基座应用核心
│   ├── base-layout.js           # 布局控制器
│   ├── base-sync.js             # API 同步基类
│   ├── base-actions.js          # 操作基类
│   ├── base-renderer.js         # 渲染基类
│   └── base-styles.css          # 基座样式
├── plugins/
│   ├── interview/
│   │   ├── interview-plugin.js  # 面试插件
│   │   ├── interview-renderer.js
│   │   └── interview-styles.css
│   └── roleplay/
│       ├── roleplay-plugin.js   # 角色扮演插件
│       ├── roleplay-renderer.js
│       └── roleplay-styles.css
├── components/
│   ├── room-browser.js          # 房间列表组件
│   ├── room-detail.js           # 房间详情组件
│   ├── message-list.js          # 消息列表组件
│   ├── character-panel.js       # 角色面板组件（新增）
│   └── scene-panel.js           # 场景面板组件（新增）
└── utils/
    ├── ui-helpers.js            # UI 工具函数
    ├── formatters.js            # 格式化函数
    └── storage-utils.js         # 存储工具
```

### 2. 插件接口

```javascript
// 房间类型插件接口
interface RoomPlugin {
  id: string;                           // 插件 ID
  name: string;                         // 显示名称
  roomType: string;                     // 对应的房间类型
  
  // 生命周期
  onInit?(app: BaseApp): void;          // 初始化
  onDestroy?(): void;                   // 销毁
  
  // 渲染扩展
  renderRoomBanner?(room: Room): string;
  renderSidePanel?(room: Room): string;
  renderMessageExtra?(message: Message): string;
  renderComposerExtra?(room: Room): string;
  
  // 操作扩展
  getActions?(room: Room): Action[];
  
  // 样式
  styles?: string;                      // 额外样式 URL
  
  // 配置
  config: {
    showParticipants?: boolean;
    showTurns?: boolean;
    showSummary?: boolean;
    showPending?: boolean;
    showCharacters?: boolean;          // 角色扮演特有
    showScene?: boolean;                // 角色扮演特有
    composerEnabled?: boolean;
    composerPlaceholder?: string;
  // Provider-specific function removed;
// Provider-specific function removed
```

### 3. 基座核心

```javascript
// base-app.js
class BaseApp {
  constructor() {
    this.plugins = new Map();
    this.currentRoomType = null;
    this.state = {
      meta: null,
      rooms: [],
      selectedRoomId: null,
      currentRoom: null,
    // Provider-specific function removed;
  // Provider-specific function removed
  
  // 插件管理
  registerPlugin(plugin: RoomPlugin): void;
  getPlugin(roomType: string): RoomPlugin;
  
  // 房间操作
  selectRoom(roomId: string): void;
  refreshRoom(): Promise<void>;
  refreshRoomList(): Promise<void>;
  
  // 渲染
  render(): void;
  renderRoomList(): void;
  renderRoomDetail(): void;
  
  // 操作
  sendMessage(message: string): Promise<void>;
  executeAction(action: string, data?: any): Promise<void>;
// Provider-specific function removed
```

### 4. 面试插件迁移

```javascript
// plugins/interview/interview-plugin.js
export const interviewPlugin = {
  id: 'interview',
  name: '面试房间',
  roomType: 'interview_simulation',
  
  config: {
    showParticipants: true,
    showTurns: true,
    showSummary: true,
    showPending: true,
    showCharacters: false,
    showScene: false,
    composerEnabled: true,
    composerPlaceholder: '输入你的回答...',
  // Provider-specific function removed,
  
  renderSidePanel(room) {
    // 面试特定的侧边栏：面试官状态、流程阶段
    return `
      <section class="side-card interviewer-panel">
        ${this.renderInterviewerStatus(room)// Provider-specific function removed
      </section>
      <section class="side-card flow-panel">
        ${this.renderFlowStage(room)// Provider-specific function removed
      </section>
    `;
  // Provider-specific function removed,
  
  styles: './plugins/interview/interview-styles.css',
// Provider-specific function removed;
```

### 5. 角色扮演插件

```javascript
// plugins/roleplay/roleplay-plugin.js
export const roleplayPlugin = {
  id: 'roleplay',
  name: '角色扮演',
  roomType: 'roleplay_scene',
  
  config: {
    showParticipants: false,
    showTurns: false,
    showSummary: false,
    showPending: false,
    showCharacters: true,
    showScene: true,
    composerEnabled: false,
  // Provider-specific function removed,
  
  renderSidePanel(room) {
    return `
      <section class="side-card character-panel">
        ${this.renderCharacterList(room)// Provider-specific function removed
      </section>
      <section class="side-card scene-panel">
        ${this.renderSceneInfo(room)// Provider-specific function removed
      </section>
    `;
  // Provider-specific function removed,
  
  renderCharacterList(room) {
    const characters = room.characters || [];
    return characters.map(c => `
      <div class="character-card ${c.status// Provider-specific function removed">
        <span class="character-name">${c.name// Provider-specific function removed</span>
        <span class="character-status">${c.status// Provider-specific function removed</span>
        <span class="character-messages">${c.messageCount// Provider-specific function removed 条消息</span>
      </div>
    `).join('');
  // Provider-specific function removed,
  
  styles: './plugins/roleplay/roleplay-styles.css',
// Provider-specific function removed;
```

### 6. HTML 结构变化

```html
<!-- index.html - 基座结构 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <title>AX-001 Room Platform</title>
  <link rel="stylesheet" href="./base/base-styles.css" />
  <!-- 插件样式动态加载 -->
</head>
<body>
  <main class="app-shell">
    <!-- 顶部栏 -->
    <header class="app-header">
      <div class="header-title">
        <h1 id="app-title">AX-001</h1>
        <span id="room-type-badge" class="room-type-badge"></span>
      </div>
      <div id="header-actions" class="header-actions"></div>
    </header>
    
    <!-- 工作区 -->
    <section class="workspace">
      <!-- 左侧：房间列表 -->
      <aside id="room-browser" class="room-browser panel">
        <!-- 房间列表 -->
      </aside>
      
      <!-- 中间：房间详情 -->
      <section id="room-detail" class="room-detail panel">
        <header id="room-banner" class="room-banner"></header>
        <div id="message-list" class="message-list"></div>
        <footer id="composer" class="composer"></footer>
      </section>
      
      <!-- 右侧：运行时面板 -->
      <aside id="runtime-panel" class="runtime-panel panel">
        <!-- 插件动态内容 -->
      </aside>
    </section>
  </main>
  
  <script type="module" src="./base/base-app.js"></script>
</body>
</html>
```

## 迁移计划

### Phase 1: 创建基座（预计 2 天）

1. 创建 `base/` 目录结构
2. 提取通用样式到 `base-styles.css`
3. 创建 `BaseApp` 核心类
4. 创建 `RoomPlugin` 接口
5. 创建通用组件

### Phase 2: 迁移面试功能（预计 1 天）

1. 创建 `plugins/interview/` 目录
2. 提取面试特定逻辑到插件
3. 提取面试特定样式
4. 验证面试功能正常

### Phase 3: 实现角色扮演插件（预计 1 天）

1. 创建 `plugins/roleplay/` 目录
2. 实现角色列表渲染
3. 实现场景信息渲染
4. 实现角色状态切换

### Phase 4: 集成测试（预计 0.5 天）

1. 测试面试房间
2. 测试角色扮演房间
3. 测试房间切换
4. 测试 Electron 桌面壳

## API 扩展

需要扩展后端 API 以支持前端基座：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/meta` | GET | 返回房间类型列表和插件配置 |
| `/api/roleplay-rooms/:id/execute` | POST | 执行 N 轮对话 |
| `/api/roleplay-rooms/:id/characters/:id/activate` | POST | 激活角色 |

## 收益

1. **新房间类型接入成本降低**：只需实现插件接口
2. **代码复用**：通用功能在基座中实现一次
3. **维护成本降低**：修改基座即可影响所有房间类型
4. **扩展性**：插件可以独立开发和测试
