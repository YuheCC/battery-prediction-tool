/**
 * Sidebar Module - 处理侧边栏的所有功能
 * 包括：展开/收缩、mini模式、历史对话、搜索等
 */

class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('chatSidebar');
        this.toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
        this.miniToggleSidebarBtn = document.getElementById('miniToggleSidebarBtn');
        this.miniNewChatBtn = document.getElementById('miniNewChatBtn');
        this.miniSearchBtn = document.getElementById('miniSearchBtn');
        this.mainNewChatBtn = document.getElementById('mainNewChatBtn');
        this.searchChatBtn = document.getElementById('searchChatBtn');
        this.chatContainer = document.querySelector('.chat-container');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initRecentChats();
        this.initChatMenus();
    }

    bindEvents() {
        // 主要切换按钮
        if (this.toggleSidebarBtn) {
            this.toggleSidebarBtn.addEventListener('click', () => this.toggleMiniMode());
        }

        // Mini模式切换按钮
        if (this.miniToggleSidebarBtn) {
            this.miniToggleSidebarBtn.addEventListener('click', () => this.toggleMiniMode());
        }

        // Mini模式新聊天按钮
        if (this.miniNewChatBtn) {
            this.miniNewChatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerNewChat();
            });
        }

        // Mini模式搜索按钮
        if (this.miniSearchBtn) {
            this.miniSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerSearchChat();
            });
        }

        // 完整模式新聊天按钮
        if (this.mainNewChatBtn) {
            this.mainNewChatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerNewChat();
            });
        }

        // 完整模式搜索按钮
        if (this.searchChatBtn) {
            this.searchChatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerSearchChat();
            });
        }
    }

    toggleMiniMode() {
        this.sidebar.classList.toggle('mini-sidebar');
        console.log('Sidebar toggled:', this.sidebar.classList.contains('mini-sidebar') ? 'Mini' : 'Expanded');
    }

    triggerNewChat() {
        console.log('New chat triggered');
        // 这里可以触发新聊天事件，让其他模块监听
        window.dispatchEvent(new CustomEvent('newChatRequested'));
    }

    triggerSearchChat() {
        console.log('Search chat triggered');
        // 这里可以触发搜索聊天事件，让其他模块监听
        window.dispatchEvent(new CustomEvent('searchChatRequested'));
    }

    initRecentChats() {
        const recentChats = document.querySelectorAll('.recent-chat');
        recentChats.forEach(chat => {
            chat.addEventListener('click', (e) => {
                e.preventDefault();
                const chatId = chat.getAttribute('data-chat-id');
                this.loadChatHistory(chatId);
            });
        });
    }

    initChatMenus() {
        const menuButtons = document.querySelectorAll('.chat-menu-btn');
        menuButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const chatId = btn.getAttribute('data-chat-id');
                this.showChatMenu(btn, chatId);
            });
        });
    }

    showChatMenu(button, chatId) {
        const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('li');
        const isPinned = chatElement && chatElement.classList.contains('pinned');
        
        const menu = document.createElement('div');
        menu.className = 'chat-delete-menu';
        menu.innerHTML = `
            <div class="delete-menu-content">
                <button class="pin-chat-btn" data-chat-id="${chatId}">${isPinned ? '取消置顶' : '置顶对话'}</button>
                <button class="delete-chat-btn" data-chat-id="${chatId}">删除对话</button>
            </div>
        `;
        
        const rect = button.getBoundingClientRect();
        menu.style.position = 'absolute';
        menu.style.top = rect.bottom + 'px';
        menu.style.left = rect.left + 'px';
        menu.style.zIndex = '1000';
        
        document.body.appendChild(menu);
        
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
        
        // 置顶/取消置顶按钮
        const pinBtn = menu.querySelector('.pin-chat-btn');
        pinBtn.addEventListener('click', () => {
            if (isPinned) {
                this.unpinChat(chatId);
            } else {
                this.pinChat(chatId);
            }
            menu.remove();
            document.removeEventListener('click', closeMenu);
        });

        // 删除按钮
        const deleteBtn = menu.querySelector('.delete-chat-btn');
        deleteBtn.addEventListener('click', () => {
            this.deleteChat(chatId);
            menu.remove();
            document.removeEventListener('click', closeMenu);
        });
    }

    loadChatHistory(chatId) {
        console.log('Loading chat history for ID:', chatId);
        // 这里可以触发加载聊天历史事件
        window.dispatchEvent(new CustomEvent('chatHistoryRequested', { detail: { chatId } }));
    }

    pinChat(chatId) {
        const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('li');
        if (chatElement) {
            chatElement.classList.add('pinned');
            const historyNav = document.querySelector('.history-nav ul');
            historyNav.insertBefore(chatElement, historyNav.firstChild);
            console.log('Pinned chat:', chatId);
        }
    }

    unpinChat(chatId) {
        const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('li');
        if (chatElement) {
            chatElement.classList.remove('pinned');
            const historyNav = document.querySelector('.history-nav ul');
            const pinnedChats = historyNav.querySelectorAll('li.pinned');
            const firstNonPinned = historyNav.querySelector('li:not(.pinned)');
            
            if (firstNonPinned) {
                historyNav.insertBefore(chatElement, firstNonPinned);
            } else {
                historyNav.appendChild(chatElement);
            }
            console.log('Unpinned chat:', chatId);
        }
    }

    deleteChat(chatId) {
        const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('li');
        if (chatElement) {
            chatElement.remove();
        }
        console.log('Deleted chat:', chatId);
    }

    // 公共方法：切换到mini模式（供其他模块调用）
    switchToMiniMode() {
        this.sidebar.classList.add('mini-sidebar');
    }

    // 公共方法：切换到完整模式（供其他模块调用）
    switchToFullMode() {
        this.sidebar.classList.remove('mini-sidebar');
    }
}

// 导出模块
window.Sidebar = Sidebar; 