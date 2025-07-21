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
                    <h1 id="moleculeName">分子名称</h1>
                </div>
                <div class="molecule-structure">
                    <h3>分子结构图</h3>
                    <div class="structure-image">
                        <img id="moleculeStructureImg" src="molecule-structure.png" alt="分子结构图" />
                    </div>
                </div>
                <div class="molecule-properties">
                    <h3>分子属性</h3>
                    <div class="properties-grid">
                        <div class="property-item">
                            <span class="property-label">SMILES:</span>
                            <span class="property-value" id="smiles">-</span>
                        </div>
                        <div class="property-item">
                            <span class="property-label">分子量:</span>
                            <span class="property-value" id="molecularWeight">-</span>
                        </div>
                        <div class="property-item">
                            <span class="property-label">预测熔点:</span>
                            <span class="property-value" id="meltingPoint">-</span>
                        </div>
                        <div class="property-item">
                            <span class="property-label">预测沸点:</span>
                            <span class="property-value" id="boilingPoint">-</span>
                        </div>
                        <div class="property-item">
                            <span class="property-label">预测闪点:</span>
                            <span class="property-value" id="flashPoint">-</span>
                        </div>
                        <div class="property-item">
                            <span class="property-label">燃烧焓:</span>
                            <span class="property-value" id="combustionEnthalpy">-</span>
                        </div>
                        <div class="property-item">
                            <span class="property-label">HOMO:</span>
                            <span class="property-value" id="homo">-</span>
                        </div>
                        <div class="property-item">
                            <span class="property-label">LUMO:</span>
                            <span class="property-value" id="lumo">-</span>
                        </div>
                        <div class="property-item">
                            <span class="property-label">ESP Max:</span>
                            <span class="property-value" id="espMax">-</span>
                        </div>
                        <div class="property-item">
                            <span class="property-label">ESP Min:</span>
                            <span class="property-value" id="espMin">-</span>
                        </div>
                        <div class="property-item full-width">
                            <span class="property-label">商业可行性:</span>
                            <span class="property-value" id="commercialViability">-</span>
                        </div>
                    </div>
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
        
        // 更新属性
        const properties = moleculeData.properties;
        Object.keys(properties).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = properties[key];
            }
        });

        // 更新分子结构图（如果有的话）
        const structureImg = document.getElementById('moleculeStructureImg');
        if (structureImg && moleculeName === 'TMSPi') {
            // 设置TMSPi的分子结构图
            structureImg.src = 'tmspi-structure.svg';
            structureImg.style.display = 'block';
        } else if (structureImg) {
            structureImg.style.display = 'none';
        }
    }

    getMoleculeData(moleculeName) {
        // 模拟数据 - 实际应用中可以从API获取
        const data = {
            'TMSPi': {
                properties: {
                    smiles: 'C[Si](C)(C)OP(=O)(C[Si](C)(C)O)C[Si](C)(C)O',
                    molecularWeight: '314.54 g/mol',
                    meltingPoint: '-9.46 °C',
                    boilingPoint: '231.99 °C',
                    flashPoint: '110.04 °C',
                    combustionEnthalpy: '-86.48 eV',
                    homo: '-7.55 eV',
                    lumo: '0.46 eV',
                    espMax: '0.71 eV',
                    espMin: '-1.83 eV',
                    commercialViability: 'Likely commercially available'
                }
            },
            'LiPF6': {
                properties: {
                    smiles: 'F[P-](F)(F)(F)(F)F.[Li+]',
                    molecularWeight: '151.91 g/mol',
                    meltingPoint: '200°C',
                    boilingPoint: '分解',
                    flashPoint: '-',
                    combustionEnthalpy: '-',
                    homo: '-',
                    lumo: '-',
                    espMax: '-',
                    espMin: '-',
                    commercialViability: 'Commercially available'
                }
            },
            'LiFSI': {
                properties: {
                    smiles: 'FS(=O)(=O)N=S(=O)(=O)F.[Li+]',
                    molecularWeight: '187.07 g/mol',
                    meltingPoint: '145°C',
                    boilingPoint: '分解',
                    flashPoint: '-',
                    combustionEnthalpy: '-',
                    homo: '-',
                    lumo: '-',
                    espMax: '-',
                    espMin: '-',
                    commercialViability: 'Commercially available'
                }
            },
            'EC': {
                properties: {
                    smiles: 'C1COC(=O)O1',
                    molecularWeight: '88.06 g/mol',
                    meltingPoint: '36.4°C',
                    boilingPoint: '248°C',
                    flashPoint: '-',
                    combustionEnthalpy: '-',
                    homo: '-',
                    lumo: '-',
                    espMax: '-',
                    espMin: '-',
                    commercialViability: 'Commercially available'
                }
            },
            'DEC': {
                properties: {
                    smiles: 'CCOC(=O)OCC',
                    molecularWeight: '118.13 g/mol',
                    meltingPoint: '-43°C',
                    boilingPoint: '126°C',
                    flashPoint: '-',
                    combustionEnthalpy: '-',
                    homo: '-',
                    lumo: '-',
                    espMax: '-',
                    espMin: '-',
                    commercialViability: 'Commercially available'
                }
            },
            'DMC': {
                properties: {
                    smiles: 'COC(=O)OC',
                    molecularWeight: '90.08 g/mol',
                    meltingPoint: '4.6°C',
                    boilingPoint: '90°C',
                    flashPoint: '-',
                    combustionEnthalpy: '-',
                    homo: '-',
                    lumo: '-',
                    espMax: '-',
                    espMin: '-',
                    commercialViability: 'Commercially available'
                }
            }
        };

        return data[moleculeName] || {
            properties: {
                smiles: '-',
                molecularWeight: '-',
                meltingPoint: '-',
                boilingPoint: '-',
                flashPoint: '-',
                combustionEnthalpy: '-',
                homo: '-',
                lumo: '-',
                espMax: '-',
                espMin: '-',
                commercialViability: '-'
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