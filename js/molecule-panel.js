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
                <div class="molecule-panel-main">
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
                <div class="similar-molecules-panel" id="similarMoleculesPanel" style="display: none;">
                    <div class="similar-molecules-header">
                        <h3>相似分子推荐</h3>
                        <button class="back-to-molecule-btn" id="backToMoleculeBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            <span>返回原分子</span>
                        </button>
                    </div>
                    <div class="similar-molecules-grid" id="similarMoleculesGrid">
                        <!-- 相似分子卡片将在这里动态生成 -->
                    </div>
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

        // 返回原分子按钮事件
        const backToMoleculeBtn = document.getElementById('backToMoleculeBtn');
        if (backToMoleculeBtn) {
            backToMoleculeBtn.addEventListener('click', () => this.backToOriginalMolecule());
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

        // 更新分子结构图
        const structureImg = document.getElementById('moleculeStructureImg');
        if (structureImg) {
            // 为所有分子显示虚拟分子结构图
            structureImg.src = 'molecule-structure.svg';
            structureImg.style.display = 'block';
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
        
        // 显示提示
        this.showNotification(`正在查找与 ${moleculeName} 相似的分子...`, 'info');
        
        // 模拟API调用延迟
        setTimeout(() => {
            this.expandPanel();
            this.loadSimilarMolecules(moleculeName);
            this.showNotification(`找到 5 个相似分子`, 'success');
        }, 1500);
    }

    // 扩展面板
    expandPanel() {
        this.panel.classList.add('expanded');
        this.chatContainer.classList.add('expanded');
    }

    // 收缩面板
    collapsePanel() {
        this.panel.classList.remove('expanded');
        this.chatContainer.classList.remove('expanded');
    }

    // 返回原分子
    backToOriginalMolecule() {
        const mainPanel = document.querySelector('.molecule-panel-main');
        const similarPanel = document.getElementById('similarMoleculesPanel');
        
        if (mainPanel && similarPanel) {
            mainPanel.style.display = 'block';
            similarPanel.style.display = 'none';
            this.collapsePanel();
        }
    }

    // 加载相似分子
    loadSimilarMolecules(originalMoleculeName) {
        const similarMolecules = this.getSimilarMolecules(originalMoleculeName);
        const grid = document.getElementById('similarMoleculesGrid');
        
        if (grid) {
            grid.innerHTML = '';
            
            similarMolecules.forEach(molecule => {
                const card = this.createSimilarMoleculeCard(molecule);
                grid.appendChild(card);
            });
        }

        // 显示相似分子面板
        const mainPanel = document.querySelector('.molecule-panel-main');
        const similarPanel = document.getElementById('similarMoleculesPanel');
        
        if (mainPanel && similarPanel) {
            mainPanel.style.display = 'none';
            similarPanel.style.display = 'block';
        }
    }

    // 创建相似分子卡片
    createSimilarMoleculeCard(molecule) {
        const card = document.createElement('div');
        card.className = 'similar-molecule-card';
        card.addEventListener('click', () => this.selectSimilarMolecule(molecule));
        
        card.innerHTML = `
            <div class="similar-molecule-header">
                <div class="similar-molecule-name">${molecule.name}</div>
                <div class="similarity-score">${molecule.similarity}%</div>
            </div>
            <div class="similar-molecule-structure">
                <img src="molecule-structure.svg" alt="${molecule.name} structure" />
            </div>
            <div class="similar-molecule-properties">
                <div class="similar-property-item">
                    <span class="similar-property-label">分子量:</span>
                    <span class="similar-property-value">${molecule.molecularWeight}</span>
                </div>
                <div class="similar-property-item">
                    <span class="similar-property-label">熔点:</span>
                    <span class="similar-property-value">${molecule.meltingPoint}</span>
                </div>
                <div class="similar-property-item">
                    <span class="similar-property-label">沸点:</span>
                    <span class="similar-property-value">${molecule.boilingPoint}</span>
                </div>
                <div class="similar-property-item">
                    <span class="similar-property-label">HOMO:</span>
                    <span class="similar-property-value">${molecule.homo}</span>
                </div>
            </div>
        `;
        
        return card;
    }

    // 选择相似分子
    selectSimilarMolecule(molecule) {
        console.log('Selected similar molecule:', molecule.name);
        this.showNotification(`已选择 ${molecule.name}`, 'success');
        
        // 这里可以加载选中分子的详细信息
        // this.showPanel(molecule.name);
    }

    // 获取相似分子数据
    getSimilarMolecules(originalMoleculeName) {
        // 模拟相似分子数据
        const similarMolecules = {
            'TMSPi': [
                { name: 'TMSi', similarity: 95, molecularWeight: '298.32 g/mol', meltingPoint: '-12.5 °C', boilingPoint: '228.5 °C', homo: '-7.42 eV' },
                { name: 'TMSCl', similarity: 88, molecularWeight: '310.45 g/mol', meltingPoint: '-8.2 °C', boilingPoint: '235.1 °C', homo: '-7.38 eV' },
                { name: 'TMSP', similarity: 82, molecularWeight: '322.18 g/mol', meltingPoint: '-5.8 °C', boilingPoint: '242.3 °C', homo: '-7.51 eV' },
                { name: 'TMSO', similarity: 78, molecularWeight: '306.29 g/mol', meltingPoint: '-15.2 °C', boilingPoint: '219.7 °C', homo: '-7.29 eV' },
                { name: 'TMSN', similarity: 75, molecularWeight: '297.34 g/mol', meltingPoint: '-3.4 °C', boilingPoint: '248.9 °C', homo: '-7.63 eV' }
            ],
            'LiPF6': [
                { name: 'LiBF4', similarity: 92, molecularWeight: '93.75 g/mol', meltingPoint: '293°C', boilingPoint: '分解', homo: '-7.12 eV' },
                { name: 'LiClO4', similarity: 85, molecularWeight: '106.39 g/mol', meltingPoint: '236°C', boilingPoint: '分解', homo: '-7.08 eV' },
                { name: 'LiAsF6', similarity: 78, molecularWeight: '195.86 g/mol', meltingPoint: '348°C', boilingPoint: '分解', homo: '-7.25 eV' },
                { name: 'LiCF3SO3', similarity: 72, molecularWeight: '156.01 g/mol', meltingPoint: '500°C', boilingPoint: '分解', homo: '-7.31 eV' },
                { name: 'LiN(SO2CF3)2', similarity: 68, molecularWeight: '287.09 g/mol', meltingPoint: '234°C', boilingPoint: '分解', homo: '-7.19 eV' }
            ],
            'LiFSI': [
                { name: 'LiTFSI', similarity: 94, molecularWeight: '287.09 g/mol', meltingPoint: '234°C', boilingPoint: '分解', homo: '-7.19 eV' },
                { name: 'LiBETI', similarity: 87, molecularWeight: '301.12 g/mol', meltingPoint: '245°C', boilingPoint: '分解', homo: '-7.22 eV' },
                { name: 'LiTDI', similarity: 81, molecularWeight: '295.08 g/mol', meltingPoint: '238°C', boilingPoint: '分解', homo: '-7.15 eV' },
                { name: 'LiPDI', similarity: 76, molecularWeight: '289.05 g/mol', meltingPoint: '241°C', boilingPoint: '分解', homo: '-7.28 eV' },
                { name: 'LiTDI', similarity: 73, molecularWeight: '293.11 g/mol', meltingPoint: '236°C', boilingPoint: '分解', homo: '-7.21 eV' }
            ]
        };

        return similarMolecules[originalMoleculeName] || [
            { name: 'Similar 1', similarity: 85, molecularWeight: '150.0 g/mol', meltingPoint: '25°C', boilingPoint: '150°C', homo: '-7.0 eV' },
            { name: 'Similar 2', similarity: 78, molecularWeight: '160.0 g/mol', meltingPoint: '30°C', boilingPoint: '160°C', homo: '-7.2 eV' },
            { name: 'Similar 3', similarity: 72, molecularWeight: '170.0 g/mol', meltingPoint: '35°C', boilingPoint: '170°C', homo: '-7.4 eV' },
            { name: 'Similar 4', similarity: 68, molecularWeight: '180.0 g/mol', meltingPoint: '40°C', boilingPoint: '180°C', homo: '-7.6 eV' },
            { name: 'Similar 5', similarity: 65, molecularWeight: '190.0 g/mol', meltingPoint: '45°C', boilingPoint: '190°C', homo: '-7.8 eV' }
        ];
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