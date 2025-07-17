# Ask页面模块化架构

## 概述

Ask页面现在采用模块化架构，将不同功能分离到独立的模块中，避免修改某个功能时影响其他功能。

## 模块结构

### 1. Sidebar Module (`js/sidebar.js`)
**功能**: 处理侧边栏的所有功能
- 展开/收缩切换
- Mini模式管理
- 历史对话管理
- 搜索聊天功能
- 对话置顶/删除

**主要方法**:
- `toggleMiniMode()` - 切换mini模式
- `switchToMiniMode()` - 切换到mini模式
- `switchToFullMode()` - 切换到完整模式
- `pinChat(chatId)` - 置顶对话
- `deleteChat(chatId)` - 删除对话

### 2. Chat Module (`js/chat.js`)
**功能**: 处理聊天对话的所有功能
- 消息发送和接收
- 消息显示和格式化
- 复制和重新生成功能
- 化学分子点击处理
- 聊天历史管理

**主要方法**:
- `sendMessage()` - 发送消息
- `insertUserMessage(text)` - 插入用户消息
- `insertBotMessage(text, showRegenerate)` - 插入机器人消息
- `copyMessage(text, button)` - 复制消息
- `clearChat()` - 清空聊天

### 3. Molecule Panel Module (`js/molecule-panel.js`)
**功能**: 处理分子详情浮层
- 分子面板显示/隐藏
- 分子数据加载
- 布局调整
- ESC键关闭

**主要方法**:
- `show(moleculeName)` - 显示分子面板
- `hide()` - 隐藏分子面板
- `isVisible()` - 检查面板是否可见
- `updateMoleculeData(moleculeName, data)` - 更新分子数据

### 4. Search Modal Module (`js/search-modal.js`)
**功能**: 处理搜索聊天弹窗
- 搜索模态框显示/隐藏
- 聊天搜索功能
- 聊天选择
- 搜索结果展示

**主要方法**:
- `show()` - 显示搜索模态框
- `hide()` - 隐藏搜索模态框
- `handleSearch(query)` - 处理搜索
- `selectChat(chatId)` - 选择聊天

### 5. App Module (`js/app.js`)
**功能**: 主应用协调器
- 模块初始化
- 模块间通信
- 全局状态管理
- 错误处理

**主要方法**:
- `getModule(moduleName)` - 获取模块实例
- `reinitializeModule(moduleName)` - 重新初始化模块
- `getStatus()` - 获取应用状态

## 模块间通信

### 事件系统
模块间通过自定义事件进行通信：

```javascript
// 触发事件
window.dispatchEvent(new CustomEvent('moleculeClicked', { 
    detail: { moleculeName } 
}));

// 监听事件
window.addEventListener('moleculeClicked', (e) => {
    // 处理分子点击事件
});
```

### 主要事件
- `moleculeClicked` - 分子被点击
- `newChatRequested` - 请求新聊天
- `searchChatRequested` - 请求搜索聊天
- `chatHistoryRequested` - 请求加载聊天历史

## 使用方式

### 获取模块实例
```javascript
// 通过全局引用
const sidebar = window.sidebarInstance;
const chat = window.chatInstance;
const moleculePanel = window.moleculePanelInstance;
const searchModal = window.searchModalInstance;

// 通过应用实例
const app = window.app;
const sidebar = app.getModule('sidebar');
```

### 调用模块方法
```javascript
// 切换到mini模式
window.sidebarInstance.switchToMiniMode();

// 显示分子面板
window.moleculePanelInstance.show('LiPF6');

// 清空聊天
window.chatInstance.clearChat();

// 显示搜索模态框
window.searchModalInstance.show();
```

### 获取应用状态
```javascript
const status = window.app.getStatus();
console.log(status);
// 输出: {
//   modules: ['sidebar', 'chat', 'moleculePanel', 'searchModal'],
//   sidebarMode: 'mini',
//   moleculePanelVisible: true,
//   searchModalVisible: false
// }
```

## 优势

1. **模块化**: 每个功能独立，便于维护
2. **解耦**: 模块间通过事件通信，降低耦合度
3. **可扩展**: 新增功能只需添加新模块
4. **可测试**: 每个模块可以独立测试
5. **可重用**: 模块可以在其他页面重用

## 修改指南

### 修改侧边栏功能
- 编辑 `js/sidebar.js`
- 不影响聊天、分子面板等其他功能

### 修改聊天功能
- 编辑 `js/chat.js`
- 不影响侧边栏、分子面板等其他功能

### 修改分子面板功能
- 编辑 `js/molecule-panel.js`
- 不影响侧边栏、聊天等其他功能

### 添加新功能
1. 创建新的模块文件 `js/new-module.js`
2. 在 `js/app.js` 中初始化新模块
3. 在 `chat.html` 中引入新模块

## 注意事项

1. 模块间通信使用事件系统，避免直接调用
2. 每个模块都有独立的错误处理
3. 模块初始化顺序很重要，确保依赖关系正确
4. 全局状态通过应用实例管理
5. 模块销毁时清理事件监听器 