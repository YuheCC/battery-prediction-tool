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
        
        // 创建消息容器
        const msgContainer = document.createElement('div');
        msgContainer.className = 'message-container';
        
        const msg = document.createElement('div');
        msg.className = 'message';
        msg.textContent = text;
        msgContainer.appendChild(msg);
        
        // 创建编辑按钮容器（只在已发送的消息上显示）
        const editBtnContainer = document.createElement('div');
        editBtnContainer.className = 'edit-btn-container';
        
        // 创建编辑按钮
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        `;
        editBtn.title = '编辑问题';
        
        // 添加编辑按钮点击事件
        editBtn.addEventListener('click', () => this.editUserMessage(msg, text));
        
        editBtnContainer.appendChild(editBtn);
        wrapper.appendChild(msgContainer);
        wrapper.appendChild(editBtnContainer);
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

    editUserMessage(messageElement, originalText) {
        // 创建编辑输入框
        const editInput = document.createElement('textarea');
        editInput.className = 'edit-input';
        editInput.value = originalText;
                        editInput.style.cssText = `
                    flex: 1;
                    min-height: 60px;
                    padding: 12px 16px;
                    border: 1px solid #56B26A;
                    border-radius: 12px;
                    font-size: 14px;
                    font-family: inherit;
                    resize: none;
                    outline: none;
                    background: white;
                    color: #333;
                    box-sizing: border-box;
                `;
        
                        // 创建按钮容器
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'edit-buttons';
                buttonContainer.style.cssText = `
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                `;
        
                        // 保存按钮
                const saveBtn = document.createElement('button');
                saveBtn.className = 'edit-save-btn';
                saveBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L21 3M21 3L13.5 21L11.25 13.5M21 3L11.25 13.5" />
                    </svg>
                `;
                saveBtn.style.cssText = `
                    padding: 8px;
                    background-color: #56B26A;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    width: 40px;
                    height: 40px;
                    flex-shrink: 0;
                `;
        
                        // 取消按钮
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'edit-cancel-btn';
                cancelBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                `;
                cancelBtn.style.cssText = `
                    padding: 8px;
                    background: none;
                    color: #6b7280;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    width: 40px;
                    height: 40px;
                    flex-shrink: 0;
                `;
        
                        // 添加悬停效果
                saveBtn.addEventListener('mouseenter', () => {
                    saveBtn.style.backgroundColor = '#4a9d5a';
                });
                saveBtn.addEventListener('mouseleave', () => {
                    saveBtn.style.backgroundColor = '#56B26A';
                });
        
                        cancelBtn.addEventListener('mouseenter', () => {
                    cancelBtn.style.color = '#374151';
                });
                cancelBtn.addEventListener('mouseleave', () => {
                    cancelBtn.style.color = '#6b7280';
                });
        
                        // 替换消息内容为编辑模式
                const messageContainer = messageElement.parentElement;
                const originalMessage = messageElement.cloneNode(true);
                
                // 创建编辑容器
                const editContainer = document.createElement('div');
                editContainer.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                `;
                
                messageContainer.innerHTML = '';
                editContainer.appendChild(cancelBtn);
                editContainer.appendChild(editInput);
                editContainer.appendChild(saveBtn);
                messageContainer.appendChild(editContainer);
        
        // 聚焦到输入框
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
        
        // 保存按钮事件
        saveBtn.addEventListener('click', () => {
            const newText = editInput.value.trim();
            if (newText && newText !== originalText) {
                // 更新消息内容
                originalMessage.textContent = newText;
                messageContainer.innerHTML = '';
                messageContainer.appendChild(originalMessage);
                
                // 重新添加编辑按钮容器和按钮
                const newEditBtnContainer = document.createElement('div');
                newEditBtnContainer.className = 'edit-btn-container';
                
                const newEditBtn = document.createElement('button');
                newEditBtn.className = 'edit-btn';
                newEditBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                `;
                newEditBtn.title = '编辑问题';
                newEditBtn.addEventListener('click', () => this.editUserMessage(originalMessage, newText));
                newEditBtnContainer.appendChild(newEditBtn);
                messageContainer.appendChild(newEditBtnContainer);
                
                console.log('Message updated:', newText);
            }
        });
        
        // 取消按钮事件
        cancelBtn.addEventListener('click', () => {
            messageContainer.innerHTML = '';
            messageContainer.appendChild(originalMessage);
            
            // 重新添加编辑按钮容器和按钮
            const newEditBtnContainer = document.createElement('div');
            newEditBtnContainer.className = 'edit-btn-container';
            
            const newEditBtn = document.createElement('button');
            newEditBtn.className = 'edit-btn';
            newEditBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            `;
            newEditBtn.title = '编辑问题';
            newEditBtn.addEventListener('click', () => this.editUserMessage(originalMessage, originalText));
            newEditBtnContainer.appendChild(newEditBtn);
            messageContainer.appendChild(newEditBtnContainer);
        });
        
        // 回车键保存，ESC键取消
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveBtn.click();
            } else if (e.key === 'Escape') {
                cancelBtn.click();
            }
        });
    }

    startNewChat() {
        console.log('Starting new chat...');
        // 清空消息区域
        this.chatMessages.innerHTML = '';
        this.insertNewChatInterface();
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
        
        // 显示底部输入框
        this.showBottomInput();
        
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
        // 显示底部输入框
        this.showBottomInput();
        
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

    insertNewChatInterface() {
        // 创建新聊天界面 - 空白的，只有输入框的页面
        const newChatContainer = document.createElement('div');
        newChatContainer.className = 'new-chat-interface';
        newChatContainer.innerHTML = `
            <div class="new-chat-content">
                <div class="new-chat-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="48" height="48">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                </div>
                <h2 class="new-chat-title">新聊天</h2>
                <p class="new-chat-subtitle">开始一段新的对话，探索分子宇宙的奥秘</p>
                <div class="new-chat-input-container">
                    <div class="new-chat-input-wrapper">
                        <textarea id="new-chat-input" placeholder="Ask me anything, as long as it's about batteries, battery chemistry, or related topics." rows="3"></textarea>
                        <button id="new-chat-send-btn" class="new-chat-send-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L21 3M21 3L13.5 21L11.25 13.5M21 3L11.25 13.5" />
                            </svg>
                        </button>
                    </div>
                    <div class="new-chat-deep-space-checkbox">
                        <label>
                            <input type="checkbox" id="new-chat-deep-space-toggle">
                            <span class="checkbox-text">Enter Deep Space (BETA)</span>
                            <span class="tooltip-icon" data-tooltip="A team of LLM agents that analyze your battery question, scour the literature and our molecule database, then collaborate to craft a research‑grade answer. Expect response times between 10-20 minutes.">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                </svg>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(newChatContainer);
        
        // 隐藏底部输入框
        this.hideBottomInput();
        
        // 绑定新聊天界面的事件
        this.bindNewChatEvents();
    }

    bindNewChatEvents() {
        const newChatInput = document.getElementById('new-chat-input');
        const newChatSendBtn = document.getElementById('new-chat-send-btn');
        const newChatDeepSpaceToggle = document.getElementById('new-chat-deep-space-toggle');
        
        if (newChatInput) {
            newChatInput.addEventListener('input', () => this.updateNewChatBtnState());
            newChatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendNewChatMessage();
                }
            });
        }
        
        if (newChatSendBtn) {
            newChatSendBtn.addEventListener('click', () => this.sendNewChatMessage());
        }
        
        if (newChatDeepSpaceToggle) {
            newChatDeepSpaceToggle.addEventListener('change', () => {
                // 同步到主输入框的Deep Space状态
                if (this.deepSpaceToggle) {
                    this.deepSpaceToggle.checked = newChatDeepSpaceToggle.checked;
                }
            });
        }
    }

    updateNewChatBtnState() {
        const newChatInput = document.getElementById('new-chat-input');
        const newChatSendBtn = document.getElementById('new-chat-send-btn');
        
        if (!newChatInput || !newChatSendBtn) return;
        
        if (newChatInput.value.trim().length > 0) {
            newChatSendBtn.classList.add('enabled');
            newChatSendBtn.disabled = false;
        } else {
            newChatSendBtn.classList.remove('enabled');
            newChatSendBtn.disabled = true;
        }
    }

    sendNewChatMessage() {
        const newChatInput = document.getElementById('new-chat-input');
        if (!newChatInput || newChatInput.value.trim().length === 0) return;

        const message = newChatInput.value.trim();
        
        // 清空新聊天界面
        this.chatMessages.innerHTML = '';
        
        // 显示底部输入框
        this.showBottomInput();
        
        // 插入用户消息
        this.insertUserMessage(message);
        
        // 检查是否为特殊命令
        if (message === '分子探索') {
            this.insertBotMessageWithButton('test', '分子');
        } else {
            // 普通消息处理
            this.insertBotMessage('test context', true);
        }
        
        // 清空新聊天输入框
        newChatInput.value = '';
        this.updateNewChatBtnState();
    }

    hideBottomInput() {
        const chatInputContainer = document.querySelector('.chat-input-container');
        if (chatInputContainer) {
            chatInputContainer.style.display = 'none';
        }
    }

    showBottomInput() {
        const chatInputContainer = document.querySelector('.chat-input-container');
        if (chatInputContainer) {
            chatInputContainer.style.display = 'block';
        }
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