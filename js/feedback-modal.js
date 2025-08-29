/**
 * Feedback Modal - 反馈弹窗模块
 * 处理用户反馈的收集和提交
 */

class FeedbackModal {
    constructor() {
        this.modal = null;
        this.button = null;
        this.closeBtn = null;
        this.cancelBtn = null;
        this.submitBtn = null;
        this.form = null;
        this.uploadArea = null;
        this.screenshotInput = null;
        this.init();
    }

    init() {
        console.log('Initializing FeedbackModal...');
        this.modal = document.getElementById('feedbackModal');
        this.button = document.getElementById('feedbackButton');
        this.closeBtn = document.getElementById('feedbackModalClose');
        this.cancelBtn = document.getElementById('feedbackCancelBtn');
        this.submitBtn = document.getElementById('feedbackSubmitBtn');
        this.form = document.getElementById('feedbackForm');
        this.uploadArea = document.getElementById('feedbackUploadArea');
        this.screenshotInput = document.getElementById('feedbackScreenshot');

        console.log('Feedback elements found:', {
            modal: !!this.modal,
            button: !!this.button,
            close: !!this.closeBtn,
            cancel: !!this.cancelBtn,
            submit: !!this.submitBtn,
            form: !!this.form,
            uploadArea: !!this.uploadArea,
            screenshot: !!this.screenshotInput
        });

        if (this.button) {
            this.setupEventListeners();
        } else {
            console.error('Feedback button not found!');
        }
    }

    setupEventListeners() {
        // 绑定反馈按钮点击事件
        console.log('Adding click event listener to feedback button');
        this.button.addEventListener('click', (e) => {
            console.log('Feedback button clicked!');
            e.preventDefault();
            e.stopPropagation();
            this.open();
        });

        // 绑定关闭按钮事件
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.close());
        }

        // 点击弹窗外部关闭
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }

        // 文件上传功能
        if (this.uploadArea && this.screenshotInput) {
            this.uploadArea.addEventListener('click', () => {
                this.screenshotInput.click();
            });

            this.screenshotInput.addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
        }

        // 表单提交功能
        if (this.form && this.submitBtn) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            this.submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.form.dispatchEvent(new Event('submit'));
            });
        }

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible()) {
                this.close();
            }
        });
    }

    open() {
        console.log('Opening feedback modal');
        if (this.modal) {
            console.log('Adding show class to feedback modal');
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Feedback modal not found!');
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
            this.resetForm();
        }
    }

    isVisible() {
        return this.modal && this.modal.classList.contains('show');
    }

    resetForm() {
        if (this.form) {
            this.form.reset();
        }
        if (this.uploadArea) {
            this.uploadArea.classList.remove('has-file');
            this.uploadArea.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span>JPG/PNG 格式，最大 5MB</span>
            `;
        }
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
                    // 检查文件类型
        if (!file.type.match('image/(jpeg|png)')) {
            alert('请选择 JPG 或 PNG 格式的文件。');
            return;
        }
        
        // 检查文件大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('文件大小必须小于 5MB。');
            return;
        }

            // 显示文件信息
            this.uploadArea.classList.add('has-file');
            this.uploadArea.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>${file.name}</span>
            `;
        }
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const feedbackData = {
            type: formData.get('feedbackType') || document.getElementById('feedbackType').value,
            description: formData.get('feedbackDescription') || document.getElementById('feedbackDescription').value,
            screenshot: this.screenshotInput.files[0] || null
        };

        // 验证必填字段
        if (!feedbackData.description.trim()) {
            alert('请提供描述内容。');
            return;
        }

        // 模拟提交
        console.log('Submitting feedback:', feedbackData);
        
        // 显示提交成功提示
        alert('感谢您的反馈！我们会尽快处理。');
        
        // 关闭弹窗
        this.close();
    }

    destroy() {
        // 清理事件监听器
        if (this.button) {
            this.button.removeEventListener('click', this.open);
        }
        if (this.closeBtn) {
            this.closeBtn.removeEventListener('click', this.close);
        }
        if (this.cancelBtn) {
            this.cancelBtn.removeEventListener('click', this.close);
        }
    }
} 