/**
 * Main Application - 协调所有模块的初始化和交互
 * 负责模块间的通信和全局状态管理
 */

class App {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        console.log('Initializing application modules...');

        try {
            // 初始化性能优化工具
            this.modules.performanceUtils = new PerformanceUtils();
            
            // 初始化各个模块
            this.modules.sidebar = new Sidebar();
            this.modules.chat = new Chat();
            this.modules.moleculePanel = new MoleculePanel();
            this.modules.searchModal = new SearchModal();
            this.modules.chatEnhancements = new ChatEnhancements();
            this.modules.modeSwitcher = new ModeSwitcher();
            this.modules.feedbackModal = new FeedbackModal();

            // 设置全局实例引用（供模块间调用）
            window.performanceUtilsInstance = this.modules.performanceUtils;
            window.sidebarInstance = this.modules.sidebar;
            window.chatInstance = this.modules.chat;
            window.moleculePanelInstance = this.modules.moleculePanel;
            window.searchModalInstance = this.modules.searchModal;
            window.chatEnhancementsInstance = this.modules.chatEnhancements;
            window.modeSwitcherInstance = this.modules.modeSwitcher;
            window.feedbackModalInstance = this.modules.feedbackModal;

            // 设置模块间的通信
            this.setupModuleCommunication();

            // 初始化性能优化
            this.initializePerformanceOptimizations();

            console.log('All modules initialized successfully');
        } catch (error) {
            console.error('Error initializing modules:', error);
        }
    }

    initializePerformanceOptimizations() {
        // 懒加载图片
        this.modules.performanceUtils.lazyLoadImages();
        
        // 预加载关键资源
        this.modules.performanceUtils.preloadResources([
            { url: 'logo.png', type: 'image' },
            { url: 'molecule-structure.png', type: 'image' }
        ]);

        // 优化滚动性能
        this.modules.performanceUtils.optimizeScroll(() => {
            // 滚动时的性能优化逻辑
        });

        // 优化窗口大小变化
        this.modules.performanceUtils.optimizeResize(() => {
            // 窗口大小变化时的优化逻辑
        });
    }

    setupModuleCommunication() {
        // 监听全局事件，协调模块间的交互
        window.addEventListener('moleculeClicked', (e) => {
            console.log('Molecule clicked, coordinating modules...');
            // 分子面板模块会自动处理这个事件
        });

        window.addEventListener('newChatRequested', (e) => {
            console.log('New chat requested, coordinating modules...');
            // 聊天模块会自动处理这个事件
        });

        window.addEventListener('searchChatRequested', (e) => {
            console.log('Search chat requested, coordinating modules...');
            // 搜索模态框模块会自动处理这个事件
        });

        window.addEventListener('chatHistoryRequested', (e) => {
            console.log('Chat history requested, coordinating modules...');
            // 聊天模块会自动处理这个事件
        });
    }

    // 公共方法：获取模块实例
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    // 公共方法：重新初始化特定模块
    reinitializeModule(moduleName) {
        if (this.modules[moduleName]) {
            console.log(`Reinitializing ${moduleName} module...`);
            // 这里可以添加重新初始化的逻辑
        }
    }

    // 公共方法：销毁所有模块
    destroy() {
        console.log('Destroying application...');
        Object.keys(this.modules).forEach(moduleName => {
            if (this.modules[moduleName] && typeof this.modules[moduleName].destroy === 'function') {
                this.modules[moduleName].destroy();
            }
        });
        this.modules = {};
    }

    // 公共方法：获取应用状态
    getStatus() {
        return {
            modules: Object.keys(this.modules),
            sidebarMode: this.modules.sidebar ? 
                (this.modules.sidebar.sidebar.classList.contains('mini-sidebar') ? 'mini' : 'full') : 'unknown',
            moleculePanelVisible: this.modules.moleculePanel ? 
                this.modules.moleculePanel.isVisible() : false,
            searchModalVisible: this.modules.searchModal ? 
                this.modules.searchModal.modal.classList.contains('show') : false
        };
    }
}

// 创建全局应用实例
window.app = new App(); 