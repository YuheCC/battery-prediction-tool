/**
 * Molecule Panel Module - 处理分子详情浮层的所有功能
 * 包括：显示、隐藏、数据加载、布局调整等
 */

class MoleculePanel {
    constructor() {
        this.panel = null;
        this.chatContainer = document.querySelector('.chat-container');
        this.chatMain = document.getElementById('chatMain');
        this.sidebar = null; // 将在初始化时设置
        
        this.init();
    }

    init() {
        this.createPanel();
        this.bindEvents();
        this.bindGlobalEvents();
    }

    createPanel() {
        // 创建分子面板
        this.panel = document.createElement('div');
        this.panel.className = 'molecule-panel';
        this.panel.id = 'moleculePanel';
        this.panel.style.display = 'none';
        
        this.panel.innerHTML = `
            <div class="molecule-panel-header">
                <h2>分子详情</h2>
                <button class="molecule-panel-close" id="moleculePanelClose">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="molecule-panel-content">
                <div class="molecule-info">
                    <h3 id="moleculeName">分子名称</h3>
                    <p id="moleculeDescription">分子描述信息将在这里显示...</p>
                </div>
                <div class="molecule-structure">
                    <h3>分子结构图</h3>
                    <div class="structure-placeholder">
                        <div class="placeholder-text">分子结构图</div>
                    </div>
                </div>
                <div class="molecule-properties">
                    <h3>分子属性</h3>
                    <ul id="moleculeProperties">
                        <li>分子量: <span id="molecularWeight">-</span></li>
                        <li>化学式: <span id="chemicalFormula">-</span></li>
                        <li>熔点: <span id="meltingPoint">-</span></li>
                        <li>沸点: <span id="boilingPoint">-</span></li>
                        <li>密度: <span id="density">-</span></li>
                    </ul>
                </div>
                <div class="molecule-panel-actions">
                    <button class="molecule-action-btn add-to-favorites-btn" id="addToFavoritesBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span>Add to Favorites</span>
                    </button>
                    <button class="molecule-action-btn find-similar-btn" id="findSimilarBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <span>Find Similar Molecules</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.panel);
    }

    bindEvents() {
        // 关闭按钮事件
        const closeBtn = document.getElementById('moleculePanelClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hidePanel());
        }

        // ESC键关闭面板
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.style.display === 'block') {
                this.hidePanel();
            }
        });

        // 添加收藏按钮事件
        const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
        if (addToFavoritesBtn) {
            addToFavoritesBtn.addEventListener('click', () => this.addToFavorites());
        }

        // 查找相似分子按钮事件
        const findSimilarBtn = document.getElementById('findSimilarBtn');
        if (findSimilarBtn) {
            findSimilarBtn.addEventListener('click', () => this.findSimilarMolecules());
        }
    }

    bindGlobalEvents() {
        // 监听分子点击事件
        window.addEventListener('moleculeClicked', (e) => {
            this.showPanel(e.detail.moleculeName);
        });
    }

    showPanel(moleculeName) {
        if (!this.panel) return;

        // 设置分子名称
        const nameElement = document.getElementById('moleculeName');
        if (nameElement) {
            nameElement.textContent = moleculeName;
        }

        // 加载分子数据
        this.loadMoleculeData(moleculeName);

        // 显示面板
        this.panel.style.display = 'block';

        // 调整布局
        this.adjustLayout(true);

        // 设置sidebar引用（如果还没有设置）
        if (!this.sidebar) {
            this.sidebar = document.getElementById('chatSidebar');
        }

        // 切换到mini模式
        if (this.sidebar && window.sidebarInstance) {
            window.sidebarInstance.switchToMiniMode();
        }

        console.log('Molecule panel shown for:', moleculeName);
    }

    hidePanel() {
        if (!this.panel) return;

        this.panel.style.display = 'none';
        this.adjustLayout(false);

        // 恢复到完整模式
        if (this.sidebar && window.sidebarInstance) {
            window.sidebarInstance.switchToFullMode();
        }

        console.log('Molecule panel hidden');
    }

    adjustLayout(showPanel) {
        if (!this.chatContainer || !this.chatMain) return;

        if (showPanel) {
            this.chatContainer.classList.add('molecule-panel-active');
        } else {
            this.chatContainer.classList.remove('molecule-panel-active');
        }
    }

    loadMoleculeData(moleculeName) {
        // 模拟分子数据
        const moleculeData = this.getMoleculeData(moleculeName);
        
        // 更新描述
        const descElement = document.getElementById('moleculeDescription');
        if (descElement) {
            descElement.textContent = moleculeData.description;
        }

        // 更新属性
        const properties = moleculeData.properties;
        Object.keys(properties).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = properties[key];
            }
        });
    }

    getMoleculeData(moleculeName) {
        // 模拟数据 - 实际应用中可以从API获取
        const data = {
            'LiPF6': {
                description: '六氟磷酸锂是一种重要的锂离子电池电解质盐，具有高离子电导率和良好的电化学稳定性。',
                properties: {
                    molecularWeight: '151.91 g/mol',
                    chemicalFormula: 'LiPF6',
                    meltingPoint: '200°C',
                    boilingPoint: '分解',
                    density: '2.84 g/cm³'
                }
            },
            'LiFSI': {
                description: '双(氟磺酰)亚胺锂是一种新型电解质盐，具有优异的热稳定性和电化学性能。',
                properties: {
                    molecularWeight: '187.07 g/mol',
                    chemicalFormula: 'LiN(SO2F)2',
                    meltingPoint: '145°C',
                    boilingPoint: '分解',
                    density: '2.15 g/cm³'
                }
            },
            'EC': {
                description: '碳酸乙烯酯是锂离子电池中最常用的溶剂之一，具有高介电常数和良好的溶解性。',
                properties: {
                    molecularWeight: '88.06 g/mol',
                    chemicalFormula: 'C3H4O3',
                    meltingPoint: '36.4°C',
                    boilingPoint: '248°C',
                    density: '1.32 g/cm³'
                }
            },
            'DEC': {
                description: '碳酸二乙酯是一种重要的有机溶剂，在锂离子电池中用作共溶剂。',
                properties: {
                    molecularWeight: '118.13 g/mol',
                    chemicalFormula: 'C5H10O3',
                    meltingPoint: '-43°C',
                    boilingPoint: '126°C',
                    density: '0.97 g/cm³'
                }
            },
            'DMC': {
                description: '碳酸二甲酯是一种低粘度溶剂，在锂离子电池中用作共溶剂。',
                properties: {
                    molecularWeight: '90.08 g/mol',
                    chemicalFormula: 'C3H6O3',
                    meltingPoint: '4.6°C',
                    boilingPoint: '90°C',
                    density: '1.07 g/cm³'
                }
            }
        };

        return data[moleculeName] || {
            description: `${moleculeName} 的详细信息正在加载中...`,
            properties: {
                molecularWeight: '-',
                chemicalFormula: moleculeName,
                meltingPoint: '-',
                boilingPoint: '-',
                density: '-'
            }
        };
    }

    // 公共方法：显示分子面板
    show(moleculeName) {
        this.showPanel(moleculeName);
    }

    // 公共方法：隐藏分子面板
    hide() {
        this.hidePanel();
    }

    // 公共方法：检查面板是否可见
    isVisible() {
        return this.panel && this.panel.style.display === 'block';
    }

    // 公共方法：更新分子数据
    updateMoleculeData(moleculeName, data) {
        if (this.isVisible() && this.panel.querySelector('#moleculeName').textContent === moleculeName) {
            this.loadMoleculeData(moleculeName);
        }
    }

    // 添加收藏功能
    addToFavorites() {
        const moleculeName = document.getElementById('moleculeName').textContent;
        console.log('Adding to favorites:', moleculeName);
        
        // 这里可以添加实际的收藏逻辑
        // 例如：发送到服务器、更新本地存储等
        
        // 显示成功提示
        this.showNotification(`${moleculeName} 已添加到收藏夹`, 'success');
        
        // 更新按钮状态（可选）
        const btn = document.getElementById('addToFavoritesBtn');
        if (btn) {
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span>已收藏</span>
            `;
            btn.disabled = true;
            btn.style.opacity = '0.6';
        }
    }

    // 查找相似分子功能
    findSimilarMolecules() {
        const moleculeName = document.getElementById('moleculeName').textContent;
        console.log('Finding similar molecules for:', moleculeName);
        
        // 这里可以添加实际的查找相似分子逻辑
        // 例如：调用API、跳转到搜索页面等
        
        // 显示提示
        this.showNotification(`正在查找与 ${moleculeName} 相似的分子...`, 'info');
        
        // 模拟API调用延迟
        setTimeout(() => {
            this.showNotification(`找到 15 个相似分子`, 'success');
            
            // 这里可以跳转到搜索结果页面或显示结果
            // window.location.href = `/search?similar=${encodeURIComponent(moleculeName)}`;
        }, 2000);
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `molecule-notification molecule-notification-${type}`;
        notification.textContent = message;
        
        // 添加到面板
        this.panel.appendChild(notification);
        
        // 自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// 导出模块
window.MoleculePanel = MoleculePanel; 