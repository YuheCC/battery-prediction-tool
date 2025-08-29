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
        
        // 推荐问题集合
        this.questionSets = [
            // 第一组问题
            [
                "锂离子电池的电解质溶剂选择有哪些关键考虑因素？",
                "固态电解质在下一代电池技术中的优势和应用前景如何？",
                "SEI层的形成机制及其对电池性能的影响是什么？",
                "高镍正极材料的稳定性问题及解决方案有哪些？",
                "锂枝晶的形成原因及抑制方法有哪些？"
            ],
            // 第二组问题
            [
                "磷酸铁锂电池与三元锂电池的性能对比如何？",
                "钠离子电池作为锂离子电池替代品的可行性如何？",
                "电池热管理系统对电池寿命的影响有哪些？",
                "快充技术对电池性能和安全性的影响是什么？",
                "电池回收技术的最新进展有哪些？"
            ],
            // 第三组问题
            [
                "石墨烯在电池材料中的应用前景如何？",
                "硅基负极材料的发展现状和挑战有哪些？",
                "固态电池的商业化进程和关键技术是什么？",
                "电池管理系统(BMS)的核心功能有哪些？",
                "电池安全测试的标准和方法有哪些？"
            ]
        ];
        this.currentQuestionSetIndex = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateBtnState();
        this.insertWelcomeMessage();
        
        // 确保发送按钮初始状态为禁用
        if (this.sendBtn) {
            this.sendBtn.disabled = true;
            this.sendBtn.style.opacity = '0.6';
        }
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
            this.sendBtn.disabled = false;
            this.sendBtn.style.opacity = '1';
        } else {
            this.sendBtn.disabled = true;
            this.sendBtn.style.opacity = '0.6';
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
        
        // 创建操作按钮容器（复制功能和编辑功能）
        const actionButtons = document.createElement('div');
        actionButtons.className = 'message-actions';
        
        // 复制按钮（放在左侧）
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
        
        // 编辑按钮（放在右侧）
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
        
        actionButtons.appendChild(editBtn);
        
        wrapper.appendChild(msgContainer);
        wrapper.appendChild(actionButtons);
        this.chatMessages.appendChild(wrapper);
    }

    insertBotMessage(text, showRegenerate = false) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper bot';
        const msg = document.createElement('div');
        msg.className = 'message';
        
        // 处理化学分子，使其可点击，并将换行符转换为HTML换行
        const processedText = text
            .replace(/\n/g, '<br>') // 将换行符转换为HTML换行
            .replace(/(LiPF6|LiFSI|EC|DEC|DMC|EMC|VC|FEC|LiF|Li2CO3|Li2O|Al2O3|ZrO2|HF)/g, '<span class="chemical-molecule" data-molecule="$1">$1</span>');
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
        
        // 获取正确的容器结构
        const messageContainer = messageElement.parentElement; // message-container
        const messageWrapper = messageContainer.parentElement; // message-wrapper
        const originalMessage = messageElement.cloneNode(true);
        
        // 清空整个消息包装器，包括编辑按钮容器
        messageWrapper.innerHTML = '';
        
        // 创建编辑容器
        const editContainer = document.createElement('div');
        editContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
        `;
        
        editContainer.appendChild(cancelBtn);
        editContainer.appendChild(editInput);
        editContainer.appendChild(saveBtn);
        messageWrapper.appendChild(editContainer);
        
        // 聚焦到输入框
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
        
        // 保存按钮事件
        saveBtn.addEventListener('click', () => {
            const newText = editInput.value.trim();
            if (newText && newText !== originalText) {
                // 更新消息内容
                originalMessage.textContent = newText;
                
                // 重建消息结构
                messageWrapper.innerHTML = '';
                
                // 重新创建消息容器
                const newMessageContainer = document.createElement('div');
                newMessageContainer.className = 'message-container';
                newMessageContainer.appendChild(originalMessage);
                
                // 重新创建操作按钮容器（复制功能和编辑功能）
                const newActionButtons = document.createElement('div');
                newActionButtons.className = 'message-actions';
                
                // 复制按钮（放在左侧）
                const newCopyBtn = document.createElement('button');
                newCopyBtn.className = 'action-btn copy-btn';
                newCopyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <rect x="4" y="4" width="12" height="16" rx="2" stroke="currentColor" fill="none"/>
                        <rect x="8" y="8" width="12" height="16" rx="2" stroke="currentColor" fill="none"/>
                    </svg>
                `;
                newCopyBtn.title = '复制';
                newCopyBtn.addEventListener('click', () => this.copyMessage(newText, newCopyBtn));
                newActionButtons.appendChild(newCopyBtn);
                
                // 编辑按钮（放在右侧）
                const newEditBtn = document.createElement('button');
                newEditBtn.className = 'edit-btn';
                newEditBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                `;
                newEditBtn.title = '编辑问题';
                newEditBtn.addEventListener('click', () => this.editUserMessage(originalMessage, newText));
                newActionButtons.appendChild(newEditBtn);
                
                // 组装消息结构
                messageWrapper.appendChild(newMessageContainer);
                messageWrapper.appendChild(newActionButtons);
                
                console.log('Message updated:', newText);
            }
        });
        
        // 取消按钮事件
        cancelBtn.addEventListener('click', () => {
            // 重建消息结构
            messageWrapper.innerHTML = '';
            
            // 重新创建消息容器
            const newMessageContainer = document.createElement('div');
            newMessageContainer.className = 'message-container';
            newMessageContainer.appendChild(originalMessage);
            
            // 重新创建操作按钮容器（复制功能和编辑功能）
            const newActionButtons = document.createElement('div');
            newActionButtons.className = 'message-actions';
            
            // 复制按钮（放在左侧）
            const newCopyBtn = document.createElement('button');
            newCopyBtn.className = 'action-btn copy-btn';
            newCopyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <rect x="4" y="4" width="12" height="16" rx="2" stroke="currentColor" fill="none"/>
                    <rect x="8" y="8" width="12" height="16" rx="2" stroke="currentColor" fill="none"/>
                </svg>
            `;
            newCopyBtn.title = '复制';
            newCopyBtn.addEventListener('click', () => this.copyMessage(originalText, newCopyBtn));
            newActionButtons.appendChild(newCopyBtn);
            
            // 编辑按钮（放在右侧）
            const newEditBtn = document.createElement('button');
            newEditBtn.className = 'edit-btn';
            newEditBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            `;
            newEditBtn.title = '编辑问题';
            newEditBtn.addEventListener('click', () => this.editUserMessage(originalMessage, originalText));
            newActionButtons.appendChild(newEditBtn);
            
            // 组装消息结构
            messageWrapper.appendChild(newMessageContainer);
            messageWrapper.appendChild(newActionButtons);
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
        
        // 对话历史数据
        const chatHistory = {
            1: {
                title: "电解质溶剂稳定性预测分析",
                messages: [
                    { type: 'user', content: '如何预测电解质溶剂的稳定性？' },
                    { type: 'bot', content: '电解质溶剂稳定性可以通过分子动力学模拟和量子化学计算来预测。主要考虑因素包括：\n\n1. 溶剂分子的分解电位\n2. 与电极材料的相容性\n3. 温度稳定性\n4. 氧化还原稳定性\n\n建议使用DFT计算溶剂分子的HOMO-LUMO能隙来评估其电化学稳定性。' }
                ]
            },
            2: {
                title: "锂枝晶形成原因及抑制方法",
                messages: [
                    { type: 'user', content: '锂枝晶形成的主要原因是什么？' },
                    { type: 'bot', content: '锂枝晶形成的主要原因包括：\n\n1. 不均匀的锂离子沉积\n2. 电解质浓度梯度\n3. 界面阻抗不均匀\n4. 温度分布不均\n\n抑制方法：\n- 使用固态电解质\n- 优化电解质配方\n- 添加成核剂\n- 控制充放电倍率' }
                ]
            },
            3: {
                title: "SEI层组成成分研究",
                messages: [
                    { type: 'user', content: 'SEI层主要由哪些成分组成？' },
                    { type: 'bot', content: 'SEI（固体电解质界面）层主要由以下成分组成：\n\n1. 无机成分：\n   - LiF, Li2CO3, Li2O\n   - 碳酸锂盐类\n\n2. 有机成分：\n   - 聚碳酸酯\n   - 烷基碳酸锂\n   - 醚类化合物\n\nSEI层的组成直接影响电池的循环性能和安全性。' }
                ]
            },
            4: {
                title: "高镍正极材料性能优化",
                messages: [
                    { type: 'user', content: '如何优化高镍正极材料的性能？' },
                    { type: 'bot', content: '高镍正极材料性能优化策略：\n\n1. 表面包覆：\n   - Al2O3, ZrO2等氧化物包覆\n   - 导电聚合物包覆\n\n2. 元素掺杂：\n   - Co, Mn, Al等元素掺杂\n   - 改善结构稳定性\n\n3. 形貌控制：\n   - 控制颗粒大小和形貌\n   - 提高振实密度' }
                ]
            },
            5: {
                title: "固态电解质界面稳定性",
                messages: [
                    { type: 'user', content: '固态电解质界面稳定性如何评估？' },
                    { type: 'bot', content: '固态电解质界面稳定性评估方法：\n\n1. 电化学测试：\n   - 循环伏安法\n   - 电化学阻抗谱\n\n2. 物理表征：\n   - SEM观察界面形貌\n   - XRD分析相结构\n   - XPS分析化学组成\n\n3. 理论计算：\n   - 界面能计算\n   - 扩散系数预测' }
                ]
            },
            6: {
                title: "电池热管理系统设计",
                messages: [
                    { type: 'user', content: '电池热管理系统的设计要点有哪些？' },
                    { type: 'bot', content: '电池热管理系统设计要点：\n\n1. 温度控制：\n   - 工作温度范围：15-35°C\n   - 温度均匀性控制\n\n2. 散热设计：\n   - 风冷/液冷系统\n   - 热管技术应用\n\n3. 安全保护：\n   - 过温保护\n   - 热失控预防\n\n4. 能效优化：\n   - 降低系统功耗\n   - 提高散热效率' }
                ]
            },
            7: {
                title: "LiFePO4石墨电池电解质推荐",
                messages: [
                    { type: 'user', content: '为LiFePO4和石墨电池推荐一种电解质' },
                    { type: 'bot', content: '对于 LiFePO4 和石墨电池，推荐使用六氟磷酸锂 - 碳酸酯电解液，其主要由六氟磷酸锂（LiPF6）、碳酸酯类有机溶剂和添加剂组成。具体介绍如下：\n\n锂盐：LiPF6 是最常用的电解质锂盐，它具有溶解性好、离子传导能力高、离子解离度高等优点，能为电池提供大量可在正负极之间穿梭的锂离子，保证电池的充放电性能。但其热稳定性差，易水解生成 HF，会导致电池性能衰减，因此在使用和储存过程中需注意保持干燥。\n\n有机溶剂：常用的有碳酸乙烯酯（EC）、碳酸二乙酯（DEC）、碳酸二甲酯（DMC）、碳酸甲乙酯（EMC）等。通常会使用多种碳酸酯混合作为溶剂，如 EC 与一种链状碳酸酯的混合溶剂，如 EC+DMC、EC+DEC 等，可在石墨负极表面形成稳定的固体电解质界面（SEI）膜，有助于提高电池的循环性能。\n\n添加剂：添加剂种类繁多，作用各异。例如，碳酸亚乙烯酯（VC）可在放电过程中生成大分子网络状聚合物参与 SEI 层的形成，降低锂离子电池首次容量损失，改善高温下 SEI 层的稳定性，提高循环寿命；氟代碳酸亚乙酯（FEC）能改善电池低温性能，增强电极材料的稳定性，是实现高安全、高倍率和长循环寿命的重要添加剂。\n\n此外，也可考虑将双亚胺锂（LiFSI）与 LiPF6 混合使用的电解液。LiFSI 具有比 LiPF6 更好的热稳定性、导离子能力及更高的锂离子迁移数，将其作为辅助锂盐与 LiPF6 混合，能充分发挥二者优势，提高电解液的电导率和锂离子迁移数，有助于降低电极表面膜阻抗，形成稳定的、导离子性较好的钝化膜，更适用于高功率锂离子电池。' }
                ]
            }
        };
        
        const chatData = chatHistory[chatId];
        if (!chatData) {
            console.log('Chat data not found for ID:', chatId);
            return;
        }
        
        this.chatMessages.innerHTML = '';
        
        // 显示底部输入框
        this.showBottomInput();
        
        // 首先插入欢迎语
        this.insertBotMessage('Welcome to the Molecular Universe. How can I help you today?', false);
        
        // 然后加载历史消息
        chatData.messages.forEach((msg, index) => {
            if (msg.type === 'user') {
                this.insertUserMessage(msg.content);
            } else {
                // 只有最后一条机器人消息显示重新生成按钮
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
                <h2 class="new-chat-title">新聊天</h2>
                <p class="new-chat-subtitle">开始一段新的对话，探索分子宇宙的奥秘</p>
                <div class="new-chat-input-container">
                    <div class="new-chat-input-wrapper">
                        <textarea id="new-chat-input" placeholder="Ask me anything, as long as it's about batteries, battery chemistry, or related topics." rows="3"></textarea>
                        <div class="new-chat-input-controls">
                            <div class="new-chat-mode-switch">
                                <button class="new-mode-btn active" data-mode="regular">
                                    <span>Regular Ask</span>
                                </button>
                                <button class="new-mode-btn" data-mode="deep-space">
                                    <span>Deep Space</span>
                                    <span class="beta-badge">Beta</span>
                                </button>
                            </div>
                            <button id="new-chat-send-btn" class="new-chat-send-btn" disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5V4.5M12 4.5L6 10.5M12 4.5L18 10.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- 推荐问题区域 -->
                <div class="recommended-questions">
                    <div class="recommended-question" data-question="锂离子电池的电解质溶剂选择有哪些关键考虑因素？">
                        <span class="question-text">锂离子电池的电解质溶剂选择有哪些关键考虑因素？</span>
                    </div>
                    
                    <div class="recommended-question" data-question="固态电解质在下一代电池技术中的优势和应用前景如何？">
                        <span class="question-text">固态电解质在下一代电池技术中的优势和应用前景如何？</span>
                    </div>
                    
                    <div class="recommended-question" data-question="SEI层的形成机制及其对电池性能的影响是什么？">
                        <span class="question-text">SEI层的形成机制及其对电池性能的影响是什么？</span>
                    </div>
                    
                    <div class="recommended-question" data-question="高镍正极材料的稳定性问题及解决方案有哪些？">
                        <span class="question-text">高镍正极材料的稳定性问题及解决方案有哪些？</span>
                    </div>
                    
                    <div class="recommended-question" data-question="锂枝晶的形成原因及抑制方法有哪些？">
                        <span class="question-text">锂枝晶的形成原因及抑制方法有哪些？</span>
                    </div>
                </div>
                
                <!-- 换一换标签 -->
                <div class="refresh-questions">
                    <button class="refresh-questions-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <span>换一换</span>
                    </button>
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
        const newChatModeButtons = document.querySelectorAll('.new-mode-btn');
        
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
        
        // 新聊天界面的模式切换事件
        if (newChatModeButtons.length > 0) {
            newChatModeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const mode = button.dataset.mode;
                    this.switchNewChatMode(mode);
                });
                
                // 添加hover事件
                button.addEventListener('mouseenter', (e) => {
                    this.showModeTooltip(e.target, button.dataset.mode);
                });
                
                button.addEventListener('mouseleave', () => {
                    this.hideModeTooltip();
                });
            });
        }
        
        // 推荐问题点击事件
        const recommendedQuestions = document.querySelectorAll('.recommended-question');
        recommendedQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const questionText = question.dataset.question;
                if (newChatInput) {
                    newChatInput.value = questionText;
                    this.updateNewChatBtnState();
                    // 直接发送问题
                    this.sendNewChatMessage();
                }
            });
        });
        
        // 换一换按钮点击事件
        const refreshBtn = document.querySelector('.refresh-questions-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshQuestions());
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

    switchNewChatMode(mode) {
        const newChatModeButtons = document.querySelectorAll('.new-mode-btn');
        const newChatInput = document.getElementById('new-chat-input');
        
        if (!newChatModeButtons.length || !newChatInput) return;

        // 更新按钮状态
        newChatModeButtons.forEach(button => {
            if (button.dataset.mode === mode) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // 更新输入框占位符
        const placeholders = {
            'regular': 'Ask me anything, as long as it\'s about batteries, battery chemistry, or related topics.',
            'deep-space': 'Enter your research question for deep analysis. This will take 10-20 minutes to process.'
        };

        newChatInput.placeholder = placeholders[mode] || placeholders.regular;

        // 添加切换动画
        const activeButton = document.querySelector(`.new-mode-btn[data-mode="${mode}"]`);
        if (activeButton) {
            activeButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                activeButton.style.transform = '';
            }, 150);
        }

        console.log(`New chat switched to ${mode} mode`);
    }

    showNewChatTooltip() {
        const tooltip = document.getElementById('newChatModeTooltip');
        if (tooltip) {
            tooltip.classList.add('show');
        }
    }

    hideNewChatTooltip() {
        const tooltip = document.getElementById('newChatModeTooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
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
    
    refreshQuestions() {
        // 切换到下一组问题
        this.currentQuestionSetIndex = (this.currentQuestionSetIndex + 1) % this.questionSets.length;
        const newQuestions = this.questionSets[this.currentQuestionSetIndex];
        
        // 获取推荐问题容器
        const questionsContainer = document.querySelector('.recommended-questions');
        if (!questionsContainer) return;
        
        // 清空现有问题
        questionsContainer.innerHTML = '';
        
        // 添加新问题
        newQuestions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.className = 'recommended-question';
            questionElement.dataset.question = question;
            questionElement.innerHTML = `<span class="question-text">${question}</span>`;
            
            // 重新绑定点击事件
            questionElement.addEventListener('click', () => {
                const newChatInput = document.getElementById('new-chat-input');
                if (newChatInput) {
                    newChatInput.value = question;
                    this.updateNewChatBtnState();
                    this.sendNewChatMessage();
                }
            });
            
            questionsContainer.appendChild(questionElement);
        });
        
        // 添加旋转动画效果
        const refreshBtn = document.querySelector('.refresh-questions-btn svg');
        if (refreshBtn) {
            refreshBtn.style.transform = 'rotate(360deg)';
            refreshBtn.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 500);
        }
    }
    
    showModeTooltip(element, mode) {
        // 移除现有的tooltip
        this.hideModeTooltip();
        
        // 创建tooltip内容
        const tooltipContent = this.getModeTooltipContent(mode);
        
        // 创建tooltip元素
        const tooltip = document.createElement('div');
        tooltip.className = 'mode-tooltip';
        tooltip.innerHTML = tooltipContent;
        
        // 强制设置最高z-index
        tooltip.style.zIndex = '2147483647';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'white';
        
        // 添加到新聊天界面容器内
        const newChatInterface = document.querySelector('.new-chat-interface');
        if (newChatInterface) {
            newChatInterface.appendChild(tooltip);
            
            // 计算位置（相对于新聊天界面容器）
            const containerRect = newChatInterface.getBoundingClientRect();
            const rect = element.getBoundingClientRect();
            
            // 设置位置（在按钮下方居中）
            const left = rect.left - containerRect.left + rect.width / 2 - 140; // 140是tooltip宽度的一半
            const top = rect.bottom - containerRect.top + 12; // 增加间距，给箭头留出空间
            
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            
            // 显示动画
            setTimeout(() => {
                tooltip.classList.add('show');
            }, 10);
        }
    }
    
    hideModeTooltip() {
        const existingTooltip = document.querySelector('.mode-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }
    
    getModeTooltipContent(mode) {
        if (mode === 'regular') {
            return `
                <div class="tooltip-header">
                    <h4>Regular Ask</h4>
                    <span class="tooltip-remaining">今日剩余: 100次</span>
                </div>
                <div class="tooltip-description">
                    基础问答模式，适合日常电池相关问题咨询。提供准确、简洁的回答。
                </div>
            `;
        } else if (mode === 'deep-space') {
            return `
                <div class="tooltip-header">
                    <h4>Deep Space</h4>
                    <span class="tooltip-remaining">本月剩余: 20次</span>
                </div>
                <div class="tooltip-description">
                    由大型语言模型智能体团队分析您的电池问题，搜索文献和我们的分子数据库，然后协作制作研究级答案。预计响应时间为10-20分钟。
                </div>
            `;
        }
        return '';
    }
}

// 导出模块
window.Chat = Chat; 