/**
 * Search Modal Module - 处理搜索聊天弹窗的所有功能
 * 包括：显示、隐藏、搜索、聊天选择等
 */

class SearchModal {
    constructor() {
        this.modal = document.getElementById('searchChatModal');
        this.searchInput = document.getElementById('searchChatInput');
        this.closeBtn = document.getElementById('searchChatClose');
        this.searchResults = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRecentChats();
    }

    bindEvents() {
        // 关闭按钮事件
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hideModal());
        }

        // 搜索输入事件
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleEnterKey();
                }
            });
        }

        // 点击模态框外部关闭
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideModal();
                }
            });
        }

        // 监听搜索聊天请求
        window.addEventListener('searchChatRequested', () => this.showModal());
    }

    showModal() {
        if (!this.modal) return;

        this.modal.classList.add('show');
        this.loadRecentChats();
        
        // 聚焦搜索输入框
        if (this.searchInput) {
            this.searchInput.focus();
        }

        console.log('Search modal shown');
    }

    hideModal() {
        if (!this.modal) return;

        this.modal.classList.remove('show');
        
        // 清空搜索输入
        if (this.searchInput) {
            this.searchInput.value = '';
        }

        console.log('Search modal hidden');
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.showAllChats();
            return;
        }

        const filteredChats = this.searchResults.filter(chat => 
            chat.title.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(filteredChats);
    }

    handleEnterKey() {
        const visibleChats = this.modal.querySelectorAll('.search-chat-item:not(.new-chat-item)');
        if (visibleChats.length > 0) {
            const firstChat = visibleChats[0];
            const chatId = firstChat.getAttribute('data-chat-id');
            if (chatId) {
                this.selectChat(chatId);
            }
        }
    }

    loadRecentChats() {
        // 模拟聊天数据
        this.searchResults = [
            { id: 1, title: '电解质溶剂稳定性预测分析' },
            { id: 2, title: '锂枝晶形成原因及抑制方法' },
            { id: 3, title: 'SEI层组成成分研究' },
            { id: 4, title: '高镍正极材料性能优化' },
            { id: 5, title: '固态电解质界面稳定性' },
            { id: 6, title: '电池热管理系统设计' },
            { id: 7, title: 'LiFePO4石墨电池电解质推荐' }
        ];

        this.showAllChats();
    }

    showAllChats() {
        this.displaySearchResults(this.searchResults);
    }

    displaySearchResults(chats) {
        const chatBody = this.modal.querySelector('.search-chat-body');
        if (!chatBody) return;

        // 保留新聊天按钮
        const newChatItem = chatBody.querySelector('.new-chat-item');
        chatBody.innerHTML = '';
        
        if (newChatItem) {
            chatBody.appendChild(newChatItem);
        }

        // 添加搜索结果
        if (chats.length > 0) {
            const section = document.createElement('div');
            section.className = 'search-chat-section';
            section.innerHTML = `
                <div class="search-chat-section-title">搜索结果</div>
            `;

            chats.forEach(chat => {
                const chatItem = document.createElement('div');
                chatItem.className = 'search-chat-item';
                chatItem.setAttribute('data-chat-id', chat.id);
                chatItem.innerHTML = `
                    <svg class="search-chat-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                    <span>${chat.title}</span>
                `;

                chatItem.addEventListener('click', () => {
                    this.selectChat(chat.id);
                });

                section.appendChild(chatItem);
            });

            chatBody.appendChild(section);
        } else {
            // 没有搜索结果
            const noResults = document.createElement('div');
            noResults.className = 'search-chat-section';
            noResults.innerHTML = `
                <div class="search-chat-section-title">搜索结果</div>
                <div class="search-chat-item" style="color: #6b7280; font-style: italic;">
                    没有找到匹配的聊天
                </div>
            `;
            chatBody.appendChild(noResults);
        }
    }

    selectChat(chatId) {
        console.log('Selected chat:', chatId);
        
        // 触发聊天历史加载事件
        window.dispatchEvent(new CustomEvent('chatHistoryRequested', { 
            detail: { chatId } 
        }));
        
        this.hideModal();
    }

    // 公共方法：显示搜索模态框
    show() {
        this.showModal();
    }

    // 公共方法：隐藏搜索模态框
    hide() {
        this.hideModal();
    }

    // 公共方法：设置搜索结果
    setSearchResults(results) {
        this.searchResults = results;
        this.showAllChats();
    }

    // 公共方法：添加聊天项
    addChatItem(chat) {
        this.searchResults.push(chat);
        this.showAllChats();
    }

    // 公共方法：移除聊天项
    removeChatItem(chatId) {
        this.searchResults = this.searchResults.filter(chat => chat.id !== chatId);
        this.showAllChats();
    }
}

// 导出模块
window.SearchModal = SearchModal; 