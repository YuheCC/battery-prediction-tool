/**
 * Chat Module - 处理聊天对话的所有功能
 * 包括：消息发送、接收、显示、复制、重新生成等
 */

class Chat {
    constructor() {
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.chatMessages = document.getElementById('chat-messages');
        this.deepSpaceToggle = document.getElementById('deep-space-toggle');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateBtnState();
        this.insertWelcomeMessage();
    }

    bindEvents() {
        // 发送按钮事件
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // 输入框事件
        if (this.input) {
            this.input.addEventListener('input', () => this.updateBtnState());
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // 监听新聊天请求
        window.addEventListener('newChatRequested', () => this.startNewChat());
        
        // 监听聊天历史请求
        window.addEventListener('chatHistoryRequested', (e) => this.loadChatHistory(e.detail.chatId));
    }

    updateBtnState() {
        if (!this.input || !this.sendBtn) return;
        
        if (this.input.value.trim().length > 0) {
            this.sendBtn.classList.add('enabled');
            this.sendBtn.disabled = false;
        } else {
            this.sendBtn.classList.remove('enabled');
            this.sendBtn.disabled = true;
        }
    }

    sendMessage() {
        if (!this.input || this.input.value.trim().length === 0) return;

        const message = this.input.value.trim();
        this.insertUserMessage(message);
        
        // 检查是否为特殊命令
        if (message === '分子探索') {
            this.insertBotMessageWithButton('test', '分子');
        } else {
            // 普通消息处理
            this.insertBotMessage('test context', true);
        }
        
        this.input.value = '';
        this.updateBtnState();
    }

    insertUserMessage(text) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper user';
        const msg = document.createElement('div');
        msg.className = 'message';
        msg.textContent = text;
        wrapper.appendChild(msg);
        this.chatMessages.appendChild(wrapper);
    }

    insertBotMessage(text, showRegenerate = false) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper bot';
        const msg = document.createElement('div');
        msg.className = 'message';
        
        // 处理化学分子，使其可点击
        const processedText = text.replace(/(LiPF6|LiFSI|EC|DEC|DMC|EMC|VC|FEC|LiF|Li2CO3|Li2O|Al2O3|ZrO2|HF)/g, '<span class="chemical-molecule" data-molecule="$1">$1</span>');
        msg.innerHTML = processedText;
        
        // 为化学分子添加点击事件
        const molecules = msg.querySelectorAll('.chemical-molecule');
        molecules.forEach(molecule => {
            molecule.addEventListener('click', () => {
                const moleculeName = molecule.getAttribute('data-molecule');
                this.handleMoleculeClick(moleculeName, molecule);
            });
        });
        
        // 创建操作按钮容器
        const actionButtons = this.createActionButtons(text, showRegenerate);
        
        wrapper.appendChild(msg);
        if (actionButtons) {
            wrapper.appendChild(actionButtons);
        }
        this.chatMessages.appendChild(wrapper);
    }

    insertBotMessageWithButton(text, buttonText) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper bot';
        const msg = document.createElement('div');
        msg.className = 'message';
        msg.textContent = text;
        
        // 创建按钮
        const button = document.createElement('button');
        button.className = 'molecule-btn';
        button.textContent = buttonText;
        button.style.cssText = `
            margin-top: 10px;
            padding: 8px 16px;
            background-color: #56B26A;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        `;
        
        button.addEventListener('click', () => {
            console.log('分子按钮被点击');
            // 这里可以添加按钮点击后的逻辑
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#4a9d5';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#56B26';
        });
        
        msg.appendChild(button);
        wrapper.appendChild(msg);
        this.chatMessages.appendChild(wrapper);
    }

    createActionButtons(text, showRegenerate) {
        const actionButtons = document.createElement('div');
        actionButtons.className = 'message-actions';
        
        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-btn copy-btn';
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <rect x="4" y="4" width="12" height="16" rx="2" stroke="currentColor" fill="none"/>
                <rect x="8" y="8" width="12" height="16" rx="2" stroke="currentColor" fill="none"/>
            </svg>
        `;
        copyBtn.title = '复制';
        
        copyBtn.addEventListener('click', () => this.copyMessage(text, copyBtn));
        actionButtons.appendChild(copyBtn);
        
        // 只有最新回复才显示重新生成按钮
        if (showRegenerate) {
            const regenerateBtn = document.createElement('button');
            regenerateBtn.className = 'action-btn regenerate-btn';
            regenerateBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            `;
            regenerateBtn.title = '重新生成';
            
            regenerateBtn.addEventListener('click', () => {
                console.log('Regenerating response...');
                // 这里可以添加重新生成的逻辑
            });
            
            actionButtons.appendChild(regenerateBtn);
        }
        
        return actionButtons;
    }

    copyMessage(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const originalIcon = button.innerHTML;
            
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            `;
            button.style.color = '#56B26A';
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.color = '#6b7280';
            }, 3000);
        });
    }

    handleMoleculeClick(moleculeName, element) {
        console.log('Clicked molecule:', moleculeName);
        
        // 显示分子详情浮层
        window.dispatchEvent(new CustomEvent('moleculeClicked', { 
            detail: { moleculeName } 
        }));
        
        // 视觉反馈
        element.style.backgroundColor = '#e8f5e8';
        setTimeout(() => {
            element.style.backgroundColor = '';
        }, 500);
    }

    startNewChat() {
        console.log('Starting new chat...');
        // 清空消息区域
        this.chatMessages.innerHTML = '';
        this.insertWelcomeMessage();
    }

    loadChatHistory(chatId) {
        console.log('Loading chat history for ID:', chatId);
        // 这里可以加载聊天历史
        // 示例数据
        const chatData = {
            title: `Chat ${chatId}`,
            messages: [
                { type: 'user', content: '用户消息示例' },
                { type: 'bot', content: '机器人回复示例' }
            ]
        };
        
        this.chatMessages.innerHTML = '';
        chatData.messages.forEach((msg, index) => {
            if (msg.type === 'user') {
                this.insertUserMessage(msg.content);
            } else {
                const isLastBotMessage = index === chatData.messages.length - 1;
                this.insertBotMessage(msg.content, isLastBotMessage);
            }
        });
        
        document.title = `Ask - ${chatData.title}`;
    }

    insertWelcomeMessage() {
        // 插入欢迎消息
        this.insertBotMessage('Welcome to the Molecular Universe. How can I help you today?');
        
        // 插入示例对话
        setTimeout(() => {
            this.insertUserMessage('为LiFePO4和石墨电池推荐一种电解质');
        }, 500);
        
        setTimeout(() => {
            this.insertBotMessage('对于LiFePO4和石墨电池，推荐使用六氟磷酸锂-碳酸酯电解液，其主要由六氟磷酸锂（LiPF6）、碳酸酯类有机溶剂和添加剂组成。具体介绍如下：\n\n- **锂盐**：LiPF6是最常用的电解质锂盐，它具有溶解性好、离子传导能力高、离子解离度高等优点，能为电池提供大量可在正负极之间穿梭的锂离子，保证电池的充放电性能。但其热稳定性差，易水解生成HF，会导致电池性能衰减，因此在使用和储存过程中需注意保持干燥。\n\n- **有机溶剂**：常用的有碳酸乙烯酯（EC）、碳酸二乙酯（DEC）、碳酸二甲酯（DMC）、碳酸甲乙酯（EMC）等。通常会使用多种碳酸酯混合作为溶剂，如EC与一种链状碳酸酯的混合溶剂，如EC+DMC、EC+DEC等，可在石墨负极表面形成稳定的固体电解质界面（SEI）膜，有助于提高电池的循环性能。\n\n- **添加剂**：添加剂种类繁多，作用各异。例如，碳酸亚乙烯酯（VC）可在放电过程中生成大分子网络状聚合物参与SEI层的形成，降低锂离子电池首次容量损失，改善高温下SEI层的稳定性，提高循环寿命；氟代碳酸亚乙酯（FEC）能改善电池低温性能，增强电极材料的稳定性，是实现高安全、高倍率和长循环寿命的重要添加剂。\n\n此外，也可考虑将双亚胺锂（LiFSI）与LiPF6混合使用的电解液。LiFSI具有比LiPF6更好的热稳定性、导离子能力及更高的锂离子迁移数，将其作为辅助锂盐与LiPF6混合，能充分发挥二者优势，提高电解液的电导率和锂离子迁移数，有助于降低电极表面膜阻抗，形成稳定的、导离子性较好的钝化膜，更适用于高功率锂离子电池。', true);
        }, 1000);
    }

    // 公共方法：清空聊天
    clearChat() {
        this.chatMessages.innerHTML = '';
        this.insertWelcomeMessage();
    }

    // 公共方法：添加用户消息
    addUserMessage(text) {
        this.insertUserMessage(text);
    }

    // 公共方法：添加机器人消息
    addBotMessage(text, showRegenerate = false) {
        this.insertBotMessage(text, showRegenerate);
    }
}

// 导出模块
window.Chat = Chat; 