/**
 * Mode Switcher - 输入模式切换模块
 * 处理Regular Ask和Deep Space模式之间的切换
 */

class ModeSwitcher {
    constructor() {
        this.currentMode = 'regular';
        this.modeButtons = null;
        this.tooltip = null;
        this.tooltipClose = null;
        this.init();
    }

    init() {
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.tooltip = document.getElementById('modeTooltip');
        this.tooltipClose = document.getElementById('tooltipClose');
        
        // 如果存在模式按钮才初始化
        if (this.modeButtons.length > 0) {
            this.setupEventListeners();
            this.updateMode('regular'); // 默认模式
        }
    }

    setupEventListeners() {
        // 模式按钮点击事件
        this.modeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const mode = button.dataset.mode;
                this.switchMode(mode);
            });

            // Deep Space按钮悬停显示提示
            if (button.dataset.mode === 'deep-space') {
                button.addEventListener('mouseenter', () => {
                    this.showTooltip();
                });

                button.addEventListener('mouseleave', () => {
                    // 延迟隐藏，给用户时间移动到提示框
                    setTimeout(() => {
                        if (!this.tooltip.matches(':hover')) {
                            this.hideTooltip();
                        }
                    }, 200);
                });
            }
        });

        // 提示框事件
        if (this.tooltip) {
            this.tooltip.addEventListener('mouseenter', () => {
                // 保持提示框显示
            });

            this.tooltip.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        }

        // 关闭按钮事件
        if (this.tooltipClose) {
            this.tooltipClose.addEventListener('click', () => {
                this.hideTooltip();
            });
        }

        // 点击外部关闭提示框
        document.addEventListener('click', (e) => {
            if (!this.tooltip?.contains(e.target) && 
                !e.target.closest('.mode-btn[data-mode="deep-space"]')) {
                this.hideTooltip();
            }
        });
    }

    switchMode(mode) {
        if (mode === this.currentMode) return;

        // 更新按钮状态
        this.modeButtons.forEach(button => {
            if (button.dataset.mode === mode) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // 更新当前模式
        this.currentMode = mode;

        // 触发模式切换事件
        const event = new CustomEvent('modeChanged', {
            detail: { mode: this.currentMode }
        });
        document.dispatchEvent(event);

        // 更新输入框占位符
        this.updatePlaceholder();

        // 添加切换动画
        this.animateModeSwitch(mode);

        console.log(`Switched to ${mode} mode`);
    }

    updatePlaceholder() {
        const textarea = document.getElementById('chat-input');
        if (!textarea) return;

        const placeholders = {
            'regular': 'Ask me anything, as long as it\'s about batteries, battery chemistry, or related topics.',
            'deep-space': 'Enter your research question for deep analysis. This will take 10-20 minutes to process.'
        };

        textarea.placeholder = placeholders[this.currentMode] || placeholders.regular;
    }

    animateModeSwitch(mode) {
        const activeButton = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
        if (!activeButton) return;

        // 添加切换动画
        activeButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            activeButton.style.transform = '';
        }, 150);
    }

    showTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.add('show');
        }
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('show');
        }
    }

    // 公共方法：获取当前模式
    getCurrentMode() {
        return this.currentMode;
    }

    // 公共方法：检查是否为Deep Space模式
    isDeepSpaceMode() {
        return this.currentMode === 'deep-space';
    }

    // 公共方法：设置模式
    setMode(mode) {
        this.switchMode(mode);
    }

    // 公共方法：获取模式配置
    getModeConfig() {
        const configs = {
            'regular': {
                name: 'Regular Ask',
                description: 'Standard AI response',
                responseTime: '1-3 minutes',
                features: ['Quick response', 'General knowledge', 'Basic analysis']
            },
            'deep-space': {
                name: 'Deep Space',
                description: 'Advanced research analysis',
                responseTime: '10-20 minutes',
                features: ['Literature review', 'Database search', 'Collaborative analysis', 'Research-grade answers']
            }
        };

        return configs[this.currentMode] || configs.regular;
    }

    // 公共方法：销毁模块
    destroy() {
        // 移除事件监听器
        this.modeButtons.forEach(button => {
            button.removeEventListener('click', this.switchMode);
        });

        if (this.tooltipClose) {
            this.tooltipClose.removeEventListener('click', this.hideTooltip);
        }

        // 清理引用
        this.modeButtons = null;
        this.tooltip = null;
        this.tooltipClose = null;
    }
}

// 导出模块
window.ModeSwitcher = ModeSwitcher; 