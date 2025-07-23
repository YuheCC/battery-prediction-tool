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
                <button class="rename-chat-btn" data-chat-id="${chatId}">
                    <svg class="menu-btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    修改名称
                </button>
                <button class="pin-chat-btn" data-chat-id="${chatId}">
                    <svg class="menu-btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01-.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                    </svg>
                    ${isPinned ? '取消置顶' : '置顶对话'}
                </button>
                <button class="delete-chat-btn" data-chat-id="${chatId}">
                    <svg class="menu-btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    删除对话
                </button>
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
        
        // 修改名称按钮
        const renameBtn = menu.querySelector('.rename-chat-btn');
        renameBtn.addEventListener('click', () => {
            this.renameChat(chatId);
            menu.remove();
            document.removeEventListener('click', closeMenu);
        });

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

    renameChat(chatId) {
        const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (!chatElement) return;
        
        const currentName = chatElement.textContent;
        
        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'chat-rename-input';
        
        // 替换原来的文本
        chatElement.textContent = '';
        chatElement.appendChild(input);
        input.focus();
        input.select();
        
        // 处理回车键确认
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const newName = input.value.trim();
                if (newName) {
                    chatElement.textContent = newName;
                    console.log('Renamed chat:', chatId, 'to:', newName);
                } else {
                    chatElement.textContent = currentName; // 如果输入为空，恢复原名
                }
            } else if (e.key === 'Escape') {
                chatElement.textContent = currentName; // 取消修改，恢复原名
            }
        });
        
        // 处理失焦事件
        input.addEventListener('blur', () => {
            const newName = input.value.trim();
            if (newName) {
                chatElement.textContent = newName;
                console.log('Renamed chat:', chatId, 'to:', newName);
            } else {
                chatElement.textContent = currentName; // 如果输入为空，恢复原名
            }
        });
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