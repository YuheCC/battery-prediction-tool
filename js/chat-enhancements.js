/**
 * Chat Enhancements - 聊天功能增强模块
 * 提供更好的用户体验和交互效果
 */

class ChatEnhancements {
    constructor() {
        this.chatInput = null;
        this.sendBtn = null;
        this.isTyping = false;
        this.typingTimeout = null;
        this.init();
    }

    init() {
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        
        if (this.chatInput && this.sendBtn) {
            this.setupAutoResize();
            this.setupTypingIndicator();
            this.setupEnhancedInteractions();
            this.setupKeyboardShortcuts();
        }
    }

    setupAutoResize() {
        // 自动调整输入框高度
        const adjustHeight = () => {
            this.chatInput.style.height = 'auto';
            const scrollHeight = this.chatInput.scrollHeight;
            const maxHeight = 200;
            const newHeight = Math.min(scrollHeight, maxHeight);
            this.chatInput.style.height = newHeight + 'px';
            
            // 更新发送按钮状态
            this.updateSendButtonState();
        };

        this.chatInput.addEventListener('input', adjustHeight);
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    setupTypingIndicator() {
        // 添加打字指示器
        this.chatInput.addEventListener('input', () => {
            this.isTyping = true;
            this.updateTypingIndicator();
            
            clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {
                this.isTyping = false;
                this.updateTypingIndicator();
            }, 1000);
        });
    }

    setupEnhancedInteractions() {
        // 增强的交互效果
        this.chatInput.addEventListener('focus', () => {
            this.chatInput.parentElement.classList.add('focused');
        });

        this.chatInput.addEventListener('blur', () => {
            this.chatInput.parentElement.classList.remove('focused');
        });

        // 发送按钮点击效果
        this.sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // 添加按钮点击动画
        this.sendBtn.addEventListener('mousedown', () => {
            this.sendBtn.style.transform = 'scale(0.95)';
        });

        this.sendBtn.addEventListener('mouseup', () => {
            this.sendBtn.style.transform = '';
        });

        this.sendBtn.addEventListener('mouseleave', () => {
            this.sendBtn.style.transform = '';
        });
    }

    setupKeyboardShortcuts() {
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter 发送消息
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
            
            // Escape 清空输入框
            if (e.key === 'Escape' && document.activeElement === this.chatInput) {
                this.chatInput.value = '';
                this.chatInput.style.height = 'auto';
                this.updateSendButtonState();
            }
        });
    }

    updateSendButtonState() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText;
        
        if (hasText) {
            this.sendBtn.classList.add('active');
        } else {
            this.sendBtn.classList.remove('active');
        }
    }

    updateTypingIndicator() {
        // 这里可以添加打字指示器的UI更新
        // 例如在聊天界面显示"正在输入..."
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // 触发发送事件
        const event = new CustomEvent('sendMessage', {
            detail: { message }
        });
        document.dispatchEvent(event);

        // 清空输入框并重置高度
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';
        this.updateSendButtonState();
        
        // 添加发送动画
        this.animateSendButton();
    }

    animateSendButton() {
        this.sendBtn.style.transform = 'scale(0.9) rotate(360deg)';
        setTimeout(() => {
            this.sendBtn.style.transform = '';
        }, 300);
    }

    // 公共方法：获取当前输入状态
    getInputState() {
        return {
            hasText: this.chatInput.value.trim().length > 0,
            isTyping: this.isTyping,
            textLength: this.chatInput.value.length
        };
    }

    // 公共方法：设置输入框内容
    setInputValue(value) {
        this.chatInput.value = value;
        this.chatInput.dispatchEvent(new Event('input'));
    }

    // 公共方法：聚焦输入框
    focusInput() {
        this.chatInput.focus();
    }

    // 公共方法：清空输入框
    clearInput() {
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';
        this.updateSendButtonState();
    }

    destroy() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
        
        // 移除事件监听器
        this.chatInput.removeEventListener('input', this.setupAutoResize);
        this.chatInput.removeEventListener('keydown', this.setupKeyboardShortcuts);
    }
}

// 导出模块
window.ChatEnhancements = ChatEnhancements; 