/**
 * Molecule Panel Module - 处理分子详情浮层的所有功能
 * 包括：显示、隐藏、数据加载、布局调整等
 */

class MoleculePanel {
    constructor() {
        this.panel = null;
        this.sidebar = null;
        this.chatContainer = document.querySelector('.chat-container');
        this.chatMain = document.getElementById('chatMain');
        
        this.init();
    }

    init() {
        // 确保先创建面板，再绑定事件
        this.createPanel();
        this.bindEvents();
        this.bindGlobalEvents();
        
        // 设置全局实例
        window.moleculePanel = this;
        
        console.log('MoleculePanel initialized, mainPanel:', document.getElementById('moleculePanelMain'));
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'molecule-panel';
        this.panel.innerHTML = `
            <div class="molecule-panel-header">
                <div class="molecule-panel-title">
                    <span>分子详情</span>
                </div>
                <button class="molecule-panel-close" onclick="window.moleculePanel.hide()">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="molecule-panel-content">
                <div class="molecule-panel-main" id="moleculePanelMain">
                    <!-- 分子卡片将在这里动态生成 -->
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
    }

    bindGlobalEvents() {
        // 监听分子点击事件
        window.addEventListener('moleculeClicked', (e) => {
            console.log('Molecule clicked event received:', e.detail);
            this.showPanel(e.detail.moleculeName);
        });
    }

    showPanel(moleculeName) {
        if (!this.panel) {
            console.error('Molecule panel not initialized');
            return;
        }

        // 显示加载状态
        this.panel.classList.add('loading');
        
        // 显示面板
        this.panel.style.display = 'block';
        this.adjustLayout(true);
        
        // 确保面板重置到单个分子宽度
        this.collapsePanel();
        
        // 切换到mini模式
        this.switchToMiniMode();
        
        // 模拟加载延迟
        setTimeout(() => {
            this.panel.classList.remove('loading');
            
            // 加载分子数据
            const moleculeData = this.getMoleculeData(moleculeName);
            
            // 创建分子卡片
            const mainPanel = document.getElementById('moleculePanelMain');
            if (!mainPanel) {
                console.error('Molecule panel main element not found');
                return;
            }
            
            const cardHTML = this.createMoleculeCard(moleculeName, moleculeData);
            mainPanel.innerHTML = cardHTML;
            
            // 绑定事件
            this.bindCardEvents(moleculeName);
            
            // 添加显示动画
            this.panel.style.opacity = '0';
            this.panel.style.transform = 'translateX(20px)';
            
            requestAnimationFrame(() => {
                this.panel.style.transition = 'all 0.3s ease';
                this.panel.style.opacity = '1';
                this.panel.style.transform = 'translateX(0)';
            });
            
        }, 300);
    }

    bindCardEvents(moleculeName) {
        // 绑定收藏按钮事件
        const addToFavoritesBtn = document.querySelector('.molecule-card-btn.add-to-favorites');
        if (addToFavoritesBtn) {
            addToFavoritesBtn.onclick = () => this.addToFavorites(moleculeName);
        }

        // 绑定查找相似分子按钮事件
        const findSimilarBtn = document.querySelector('.molecule-card-btn.find-similar');
        if (findSimilarBtn) {
            findSimilarBtn.onclick = () => this.findSimilarMolecules(moleculeName);
        }
    }

    hidePanel() {
        if (!this.panel) return;
        
        // 添加隐藏动画
        this.panel.style.transition = 'all 0.3s ease';
        this.panel.style.opacity = '0';
        this.panel.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            this.panel.style.display = 'none';
            this.adjustLayout(false);
            this.panel.style.opacity = '';
            this.panel.style.transform = '';
            
            // 恢复到完整模式
            this.switchToFullMode();
        }, 300);
    }

    adjustLayout(showPanel) {
        if (!this.chatContainer || !this.chatMain) return;

        if (showPanel) {
            this.chatContainer.classList.add('molecule-panel-active');
            // 确保主内容区域有足够空间，使用380px的分子面板宽度和50px的mini侧边栏宽度
            this.chatMain.style.marginRight = '380px';
            this.chatMain.style.maxWidth = 'calc(100vw - 380px - 50px)';
        } else {
            this.chatContainer.classList.remove('molecule-panel-active');
            // 恢复主内容区域
            this.chatMain.style.marginRight = '';
            this.chatMain.style.maxWidth = '';
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
                    flashPoint: 'N/A',
                    combustionEnthalpy: '-N/A',
                    homo: '-N/A',
                    lumo: '-N/A',
                    espMax: '-N/A',
                    espMin: '-N/A',
                    commercialViability: 'Commercially available'
                }
            },
            'LiFSI': {
                properties: {
                    smiles: 'F[P-](F)(F)(F)(F)F.[Li+]',
                    molecularWeight: '187.07 g/mol',
                    meltingPoint: '145°C',
                    boilingPoint: '分解',
                    flashPoint: 'N/A',
                    combustionEnthalpy: '-N/A',
                    homo: '-N/A',
                    lumo: '-N/A',
                    espMax: '-N/A',
                    espMin: '-N/A',
                    commercialViability: 'Commercially available'
                }
            },
            'EC': {
                properties: {
                    smiles: 'C1COC(=O)O1',
                    molecularWeight: '88.06 g/mol',
                    meltingPoint: '36.4°C',
                    boilingPoint: '248°C',
                    flashPoint: '160°C',
                    combustionEnthalpy: '-N/A',
                    homo: '-N/A',
                    lumo: '-N/A',
                    espMax: '-N/A',
                    espMin: '-N/A',
                    commercialViability: 'Commercially available'
                }
            },
            'DEC': {
                properties: {
                    smiles: 'CCOC(=O)OCC',
                    molecularWeight: '118.13 g/mol',
                    meltingPoint: '-43°C',
                    boilingPoint: '126°C',
                    flashPoint: '25°C',
                    combustionEnthalpy: '-N/A',
                    homo: '-N/A',
                    lumo: '-N/A',
                    espMax: '-N/A',
                    espMin: '-N/A',
                    commercialViability: 'Commercially available'
                }
            },
            'DMC': {
                properties: {
                    smiles: 'COC(=O)OC',
                    molecularWeight: '90.08 g/mol',
                    meltingPoint: '4.6°C',
                    boilingPoint: '90°C',
                    flashPoint: '17°C',
                    combustionEnthalpy: '-N/A',
                    homo: '-N/A',
                    lumo: '-N/A',
                    espMax: '-N/A',
                    espMin: '-N/A',
                    commercialViability: 'Commercially available'
                }
            },
            'EMC': {
                properties: {
                    smiles: 'CCOC(=O)OC',
                    molecularWeight: '104.10 g/mol',
                    meltingPoint: '-55°C',
                    boilingPoint: '110°C',
                    flashPoint: '25°C',
                    combustionEnthalpy: '-N/A',
                    homo: '-N/A',
                    lumo: '-N/A',
                    espMax: '-N/A',
                    espMin: '-N/A',
                    commercialViability: 'Commercially available'
                }
            },
            'VC': {
                properties: {
                    smiles: 'C1=CC(=O)OC1',
                    molecularWeight: '86.05 g/mol',
                    meltingPoint: '19°C',
                    boilingPoint: '162°C',
                    flashPoint: '67°C',
                    combustionEnthalpy: '-N/A',
                    homo: '-N/A',
                    lumo: '-N/A',
                    espMax: '-N/A',
                    espMin: '-N/A',
                    commercialViability: 'Commercially available'
                }
            },
            'FEC': {
                properties: {
                    smiles: 'C1COC(=O)O1F',
                    molecularWeight: '106.05 g/mol',
                    meltingPoint: '18°C',
                    boilingPoint: '220°C',
                    flashPoint: '110°C',
                    combustionEnthalpy: '-N/A',
                    homo: '-N/A',
                    lumo: '-N/A',
                    espMax: '-N/A',
                    espMin: '-N/A',
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
                commercialViability: 'Unknown'
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
    addToFavorites(moleculeName) {
        console.log('Adding to favorites:', moleculeName);
        
        // 获取收藏列表
        const favorites = JSON.parse(localStorage.getItem('moleculeFavorites') || '[]');
        
        if (!favorites.includes(moleculeName)) {
            // 添加到收藏
            favorites.push(moleculeName);
            localStorage.setItem('moleculeFavorites', JSON.stringify(favorites));
        } else {
            // 从收藏中移除
            const index = favorites.indexOf(moleculeName);
            favorites.splice(index, 1);
            localStorage.setItem('moleculeFavorites', JSON.stringify(favorites));
        }
        
        // 更新按钮状态
        this.updateFavoriteButtonState(moleculeName);
    }
    
    // 检查分子是否已收藏
    isFavorited(moleculeName) {
        const favorites = JSON.parse(localStorage.getItem('moleculeFavorites') || '[]');
        return favorites.includes(moleculeName);
    }
    
    // 更新收藏按钮状态
    updateFavoriteButtonState(moleculeName) {
        const buttons = document.querySelectorAll(`[onclick*="addToFavorites('${moleculeName}')"]`);
        buttons.forEach(button => {
            if (this.isFavorited(moleculeName)) {
                button.classList.add('favorited');
            } else {
                button.classList.remove('favorited');
            }
        });
    }
    
    // 更新分子类型
    updateMoleculeType(moleculeName, type) {
        console.log('Updating molecule type:', moleculeName, 'to', type);
        
        // 保存分子类型到localStorage
        const moleculeTypes = JSON.parse(localStorage.getItem('moleculeTypes') || '{}');
        moleculeTypes[moleculeName] = type;
        localStorage.setItem('moleculeTypes', JSON.stringify(moleculeTypes));
    }
    
    // 获取分子类型
    getMoleculeType(moleculeName) {
        const moleculeTypes = JSON.parse(localStorage.getItem('moleculeTypes') || '{}');
        return moleculeTypes[moleculeName] || 'all'; // 默认为所有类型
    }

    // 查找相似分子功能
    findSimilarMolecules(moleculeName) {
        console.log('Finding similar molecules for:', moleculeName);
        
        // 获取当前选择的分子类型
        const moleculeType = this.getMoleculeType(moleculeName);
        console.log('Molecule type for search:', moleculeType);
        
        // 显示加载状态
        this.panel.classList.add('loading');
        
        setTimeout(() => {
            this.panel.classList.remove('loading');
            
            // 获取相似分子数据（基于分子类型）
            const similarMolecules = this.getSimilarMolecules(moleculeName, moleculeType);
            
            // 创建两列布局
            const mainPanel = document.getElementById('moleculePanelMain');
            if (!mainPanel) return;
            
            const originalMoleculeData = this.getMoleculeData(moleculeName);
            const originalCardHTML = this.createMoleculeCard(moleculeName, originalMoleculeData);
            
            const similarCardsHTML = this.createSimilarMoleculesSection(similarMolecules);
            
            mainPanel.innerHTML = `
                <div class="similar-molecules-comparison">
                    <div class="original-molecule-section">
                        <h3 class="section-title">原始分子</h3>
                        ${originalCardHTML}
                    </div>
                    <div class="similar-molecules-section">
                        <h3 class="section-title">相似分子 (${similarMolecules.length})</h3>
                        <div class="similar-molecules-grid">
                            ${similarCardsHTML}
                        </div>
                    </div>
                </div>
            `;
            
            // 绑定相似分子事件
            this.bindSimilarMoleculesEvents();
            
            // 扩展面板
            this.expandPanel();
            
        }, 500);
    }

    // 创建相似分子区域
    createSimilarMoleculesSection(similarMolecules) {
        const similarCardsHTML = similarMolecules.map(molecule => 
            this.createSimilarMoleculeCard(molecule)
        ).join('');
        
        return similarCardsHTML;
    }

    // 绑定相似分子事件
    bindSimilarMoleculesEvents() {
        // 绑定相似分子卡片点击事件
        const similarCards = document.querySelectorAll('.similar-molecules-grid .molecule-card');
        similarCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // 如果点击的是按钮，不触发卡片点击事件
                if (e.target.closest('.molecule-card-btn')) {
                    return;
                }
                
                // 如果点击的是功能组header，不触发卡片点击事件
                if (e.target.closest('.functional-groups-header')) {
                    return;
                }
                
                const moleculeName = card.querySelector('.molecule-card-name').textContent;
                console.log('Clicked similar molecule:', moleculeName);
                this.selectSimilarMolecule({ name: moleculeName });
            });
        });
    }

    expandPanel() {
        if (this.panel) {
            this.panel.classList.add('expanded');
            this.chatContainer.classList.add('expanded');
            // 调整主内容区域以适应扩展的面板，使用730px的分子面板宽度和50px的mini侧边栏宽度
            if (this.chatMain) {
                this.chatMain.style.marginRight = '730px';
                this.chatMain.style.maxWidth = 'calc(100vw - 730px - 50px)';
            }
        }
    }

    collapsePanel() {
        if (this.panel) {
            this.panel.classList.remove('expanded');
            this.chatContainer.classList.remove('expanded');
            // 恢复主内容区域，使用380px的分子面板宽度和50px的mini侧边栏宽度
            if (this.chatMain) {
                this.chatMain.style.marginRight = '380px';
                this.chatMain.style.maxWidth = 'calc(100vw - 380px - 50px)';
            }
        }
    }





    // 创建分子卡片（用于主面板显示）
    createMoleculeCard(moleculeName, moleculeData) {
        const properties = moleculeData.properties || moleculeData;
        return `
            <div class="molecule-card">
                <div class="molecule-card-header">
                    <h3 class="molecule-card-name">${moleculeName}</h3>
                    <button class="molecule-card-favorite-btn ${this.isFavorited(moleculeName) ? 'favorited' : ''}" onclick="window.moleculePanel.addToFavorites('${moleculeName}')" title="${this.isFavorited(moleculeName) ? '取消收藏' : '收藏'}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
                </div>
                <div class="molecule-card-structure">
                    <div class="molecule-structure-diagram">
                        <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                            <!-- 分子结构图 - 2D化学结构风格 -->
                            <defs>
                                <style>
                                    .atom { font-family: Arial, sans-serif; font-weight: bold; }
                                    .carbon { fill: #000; font-size: 14px; }
                                    .oxygen { fill: #ff0000; font-size: 14px; }
                                    .fluorine { fill: #00ff00; font-size: 14px; }
                                    .nitrogen { fill: #0000ff; font-size: 14px; }
                                    .hydrogen { fill: #666; font-size: 12px; }
                                    .bond { stroke: #000; stroke-width: 2; fill: none; }
                                    .double-bond { stroke: #000; stroke-width: 3; fill: none; }
                                    .ring { stroke: #000; stroke-width: 2; fill: none; }
                                </style>
                            </defs>
                            
                            <!-- 根据分子名称显示不同的结构图 -->
                            ${this.getMoleculeStructureSVG(moleculeName)}
                        </svg>
                    </div>
                </div>
                <div class="molecule-card-properties">
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">SMILES:</span>
                        <span class="molecule-card-property-value">${properties.smiles || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Molecular Weight:</span>
                        <span class="molecule-card-property-value">${properties.molecularWeight || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Predicted Melting Point:</span>
                        <span class="molecule-card-property-value">${properties.meltingPoint || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Predicted Boiling Point:</span>
                        <span class="molecule-card-property-value">${properties.boilingPoint || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Predicted Flash Point:</span>
                        <span class="molecule-card-property-value">${properties.flashPoint || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Combustion Enthalpy:</span>
                        <span class="molecule-card-property-value">${properties.combustionEnthalpy || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">HOMO:</span>
                        <span class="molecule-card-property-value">${properties.homo || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">LUMO:</span>
                        <span class="molecule-card-property-value">${properties.lumo || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">ESP Max:</span>
                        <span class="molecule-card-property-value">${properties.espMax || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">ESP Min:</span>
                        <span class="molecule-card-property-value">${properties.espMin || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item commercial-viability">
                        <span class="molecule-card-property-label">Commercial Viability:</span>
                        <span class="molecule-card-property-value">${properties.commercialViability || '-'}</span>
                    </div>
                </div>
                
                <!-- 可展开/收起的功能组信息栏 -->
                <div class="functional-groups-section">
                    <div class="functional-groups-header collapsed" onclick="window.moleculePanel.toggleFunctionalGroups(event)">
                        <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                        <span class="functional-groups-title">click to expand for more details</span>
                    </div>
                    <div class="functional-groups-content">
                        <h4>Functional Groups</h4>
                        <p>Ether, Ketal, Carbonate, Ester</p>
                    </div>
                </div>
                
                <div class="molecule-card-actions">
                    <select class="molecule-type-select" onchange="window.moleculePanel.updateMoleculeType('${moleculeName}', this.value)">
                        <option value="all" ${this.getMoleculeType(moleculeName) === 'all' ? 'selected' : ''}>所有类型</option>
                        <option value="solvent" ${this.getMoleculeType(moleculeName) === 'solvent' ? 'selected' : ''}>Solvent</option>
                        <option value="diluent" ${this.getMoleculeType(moleculeName) === 'diluent' ? 'selected' : ''}>Diluent</option>
                        <option value="additive" ${this.getMoleculeType(moleculeName) === 'additive' ? 'selected' : ''}>Additive</option>
                    </select>
                    <button class="molecule-card-btn find-similar" onclick="window.moleculePanel.findSimilarMolecules('${moleculeName}')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <span>查找相似</span>
                    </button>
                </div>
            </div>
        `;
    }

    // 根据分子名称生成对应的2D化学结构图
    getMoleculeStructureSVG(moleculeName) {
        const structures = {
            'FEC': `
                <!-- FEC (Fluoroethylene Carbonate) 结构 -->
                <!-- 五元环结构 -->
                <path class="ring" d="M60,60 L80,50 L100,60 L90,80 L70,80 Z"/>
                <!-- 双键 -->
                <path class="double-bond" d="M80,50 L100,60"/>
                <!-- 单键 -->
                <path class="bond" d="M60,60 L80,50"/>
                <path class="bond" d="M100,60 L90,80"/>
                <path class="bond" d="M90,80 L70,80"/>
                <path class="bond" d="M70,80 L60,60"/>
                <!-- 原子标签 -->
                <text x="80" y="45" class="atom oxygen">O</text>
                <text x="100" y="65" class="atom oxygen">O</text>
                <text x="60" y="65" class="atom carbon">C</text>
                <text x="90" y="85" class="atom carbon">C</text>
                <text x="70" y="85" class="atom carbon">C</text>
                <!-- 氟原子 -->
                <text x="90" y="95" class="atom fluorine">F</text>
                <path class="bond" d="M90,80 L90,95"/>
            `,
            'LiPF6': `
                <!-- LiPF6 结构 -->
                <text x="100" y="40" class="atom carbon">Li</text>
                <text x="100" y="60" class="atom carbon">P</text>
                <text x="80" y="70" class="atom fluorine">F</text>
                <text x="120" y="70" class="atom fluorine">F</text>
                <text x="100" y="80" class="atom fluorine">F</text>
                <text x="90" y="90" class="atom fluorine">F</text>
                <text x="110" y="90" class="atom fluorine">F</text>
                <text x="100" y="100" class="atom fluorine">F</text>
                <!-- 键 -->
                <path class="bond" d="M100,40 L100,60"/>
                <path class="bond" d="M100,60 L80,70"/>
                <path class="bond" d="M100,60 L120,70"/>
                <path class="bond" d="M100,60 L100,80"/>
                <path class="bond" d="M100,60 L90,90"/>
                <path class="bond" d="M100,60 L110,90"/>
                <path class="bond" d="M100,60 L100,100"/>
            `,
            'EC': `
                <!-- EC (Ethylene Carbonate) 结构 -->
                <!-- 五元环结构 -->
                <path class="ring" d="M60,60 L80,50 L100,60 L90,80 L70,80 Z"/>
                <!-- 双键 -->
                <path class="double-bond" d="M80,50 L100,60"/>
                <!-- 单键 -->
                <path class="bond" d="M60,60 L80,50"/>
                <path class="bond" d="M100,60 L90,80"/>
                <path class="bond" d="M90,80 L70,80"/>
                <path class="bond" d="M70,80 L60,60"/>
                <!-- 原子标签 -->
                <text x="80" y="45" class="atom oxygen">O</text>
                <text x="100" y="65" class="atom oxygen">O</text>
                <text x="60" y="65" class="atom carbon">C</text>
                <text x="90" y="85" class="atom carbon">C</text>
                <text x="70" y="85" class="atom carbon">C</text>
                <!-- 氢原子 -->
                <text x="90" y="95" class="atom hydrogen">H</text>
                <text x="70" y="95" class="atom hydrogen">H</text>
                <path class="bond" d="M90,80 L90,95"/>
                <path class="bond" d="M70,80 L70,95"/>
            `,
            'DEC': `
                <!-- DEC (Diethyl Carbonate) 结构 -->
                <text x="100" y="40" class="atom carbon">C</text>
                <text x="80" y="50" class="atom oxygen">O</text>
                <text x="120" y="50" class="atom oxygen">O</text>
                <text x="70" y="60" class="atom carbon">C</text>
                <text x="130" y="60" class="atom carbon">C</text>
                <text x="60" y="70" class="atom hydrogen">H</text>
                <text x="80" y="70" class="atom hydrogen">H</text>
                <text x="120" y="70" class="atom hydrogen">H</text>
                <text x="140" y="70" class="atom hydrogen">H</text>
                <!-- 键 -->
                <path class="double-bond" d="M100,40 L80,50"/>
                <path class="double-bond" d="M100,40 L120,50"/>
                <path class="bond" d="M80,50 L70,60"/>
                <path class="bond" d="M120,50 L130,60"/>
                <path class="bond" d="M70,60 L60,70"/>
                <path class="bond" d="M70,60 L80,70"/>
                <path class="bond" d="M130,60 L120,70"/>
                <path class="bond" d="M130,60 L140,70"/>
            `,
            'DMC': `
                <!-- DMC (Dimethyl Carbonate) 结构 -->
                <text x="100" y="40" class="atom carbon">C</text>
                <text x="80" y="50" class="atom oxygen">O</text>
                <text x="120" y="50" class="atom oxygen">O</text>
                <text x="70" y="60" class="atom carbon">C</text>
                <text x="130" y="60" class="atom carbon">C</text>
                <text x="60" y="70" class="atom hydrogen">H</text>
                <text x="80" y="70" class="atom hydrogen">H</text>
                <text x="120" y="70" class="atom hydrogen">H</text>
                <text x="140" y="70" class="atom hydrogen">H</text>
                <!-- 键 -->
                <path class="double-bond" d="M100,40 L80,50"/>
                <path class="double-bond" d="M100,40 L120,50"/>
                <path class="bond" d="M80,50 L70,60"/>
                <path class="bond" d="M120,50 L130,60"/>
                <path class="bond" d="M70,60 L60,70"/>
                <path class="bond" d="M70,60 L80,70"/>
                <path class="bond" d="M130,60 L120,70"/>
                <path class="bond" d="M130,60 L140,70"/>
            `,
            'EMC': `
                <!-- EMC (Ethyl Methyl Carbonate) 结构 -->
                <text x="100" y="40" class="atom carbon">C</text>
                <text x="80" y="50" class="atom oxygen">O</text>
                <text x="120" y="50" class="atom oxygen">O</text>
                <text x="70" y="60" class="atom carbon">C</text>
                <text x="130" y="60" class="atom carbon">C</text>
                <text x="60" y="70" class="atom hydrogen">H</text>
                <text x="80" y="70" class="atom hydrogen">H</text>
                <text x="120" y="70" class="atom hydrogen">H</text>
                <text x="140" y="70" class="atom hydrogen">H</text>
                <!-- 键 -->
                <path class="double-bond" d="M100,40 L80,50"/>
                <path class="double-bond" d="M100,40 L120,50"/>
                <path class="bond" d="M80,50 L70,60"/>
                <path class="bond" d="M120,50 L130,60"/>
                <path class="bond" d="M70,60 L60,70"/>
                <path class="bond" d="M70,60 L80,70"/>
                <path class="bond" d="M130,60 L120,70"/>
                <path class="bond" d="M130,60 L140,70"/>
            `,
            'VC': `
                <!-- VC (Vinyl Carbonate) 结构 -->
                <text x="100" y="40" class="atom carbon">C</text>
                <text x="80" y="50" class="atom carbon">C</text>
                <text x="120" y="50" class="atom oxygen">O</text>
                <text x="70" y="60" class="atom carbon">C</text>
                <text x="130" y="60" class="atom carbon">C</text>
                <text x="60" y="70" class="atom hydrogen">H</text>
                <text x="80" y="70" class="atom hydrogen">H</text>
                <text x="120" y="70" class="atom hydrogen">H</text>
                <text x="140" y="70" class="atom hydrogen">H</text>
                <!-- 键 -->
                <path class="double-bond" d="M100,40 L80,50"/>
                <path class="double-bond" d="M100,40 L120,50"/>
                <path class="bond" d="M80,50 L70,60"/>
                <path class="bond" d="M120,50 L130,60"/>
                <path class="bond" d="M70,60 L60,70"/>
                <path class="bond" d="M70,60 L80,70"/>
                <path class="bond" d="M130,60 L120,70"/>
                <path class="bond" d="M130,60 L140,70"/>
            `,
            'FEC': `
                <!-- FEC (Fluoroethylene Carbonate) 结构 -->
                <text x="100" y="40" class="atom carbon">C</text>
                <text x="80" y="50" class="atom carbon">C</text>
                <text x="120" y="50" class="atom oxygen">O</text>
                <text x="70" y="60" class="atom carbon">C</text>
                <text x="130" y="60" class="atom carbon">C</text>
                <text x="60" y="70" class="atom fluorine">F</text>
                <text x="80" y="70" class="atom hydrogen">H</text>
                <text x="120" y="70" class="atom hydrogen">H</text>
                <text x="140" y="70" class="atom hydrogen">H</text>
                <!-- 键 -->
                <path class="double-bond" d="M100,40 L80,50"/>
                <path class="double-bond" d="M100,40 L120,50"/>
                <path class="bond" d="M80,50 L70,60"/>
                <path class="bond" d="M120,50 L130,60"/>
                <path class="bond" d="M70,60 L60,70"/>
                <path class="bond" d="M70,60 L80,70"/>
                <path class="bond" d="M130,60 L120,70"/>
                <path class="bond" d="M130,60 L140,70"/>
            `,
            'TMSPi': `
                <!-- TMSPi 结构 -->
                <text x="100" y="40" class="atom silicon">Si</text>
                <text x="80" y="50" class="atom carbon">C</text>
                <text x="120" y="50" class="atom carbon">C</text>
                <text x="100" y="60" class="atom oxygen">O</text>
                <text x="90" y="70" class="atom phosphorus">P</text>
                <text x="110" y="70" class="atom oxygen">O</text>
                <text x="100" y="80" class="atom oxygen">O</text>
                <!-- 键 -->
                <path class="bond" d="M100,40 L80,50"/>
                <path class="bond" d="M100,40 L120,50"/>
                <path class="bond" d="M100,40 L100,60"/>
                <path class="bond" d="M100,60 L90,70"/>
                <path class="bond" d="M100,60 L110,70"/>
                <path class="bond" d="M100,60 L100,80"/>
            `
        };

        return structures[moleculeName] || `
            <!-- 默认结构 -->
            <text x="100" y="60" class="atom carbon">C</text>
            <text x="80" y="70" class="atom hydrogen">H</text>
            <text x="120" y="70" class="atom hydrogen">H</text>
            <text x="100" y="80" class="atom hydrogen">H</text>
            <text x="100" y="90" class="atom hydrogen">H</text>
            <!-- 键 -->
            <path class="bond" d="M100,60 L80,70"/>
            <path class="bond" d="M100,60 L120,70"/>
            <path class="bond" d="M100,60 L100,80"/>
            <path class="bond" d="M100,60 L100,90"/>
        `;
    }



    // 创建相似分子卡片
    createSimilarMoleculeCard(molecule) {
        const properties = molecule.properties || molecule;
        return `
            <div class="molecule-card">
                <div class="molecule-card-header">
                    <h3 class="molecule-card-name">${molecule.name}</h3>
                    <button class="molecule-card-favorite-btn ${this.isFavorited(molecule.name) ? 'favorited' : ''}" onclick="event.stopPropagation(); window.moleculePanel.addToFavorites('${molecule.name}')" title="${this.isFavorited(molecule.name) ? '取消收藏' : '收藏'}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
                </div>
                <div class="molecule-card-structure">
                    <div class="molecule-structure-diagram">
                        <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                            <!-- 分子结构图 - 2D化学结构风格 -->
                            <defs>
                                <style>
                                    .atom { font-family: Arial, sans-serif; font-weight: bold; }
                                    .carbon { fill: #000; font-size: 14px; }
                                    .oxygen { fill: #ff0000; font-size: 14px; }
                                    .fluorine { fill: #00ff00; font-size: 14px; }
                                    .nitrogen { fill: #0000ff; font-size: 14px; }
                                    .hydrogen { fill: #666; font-size: 12px; }
                                    .bond { stroke: #000; stroke-width: 2; fill: none; }
                                    .double-bond { stroke: #000; stroke-width: 3; fill: none; }
                                    .ring { stroke: #000; stroke-width: 2; fill: none; }
                                </style>
                            </defs>
                            
                            <!-- 根据分子名称显示不同的结构图 -->
                            ${this.getMoleculeStructureSVG(molecule.name)}
                        </svg>
                    </div>
                </div>
                <div class="molecule-card-properties">
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">SMILES:</span>
                        <span class="molecule-card-property-value">${properties.smiles || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Molecular Weight:</span>
                        <span class="molecule-card-property-value">${properties.molecularWeight || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Predicted Melting Point:</span>
                        <span class="molecule-card-property-value">${properties.meltingPoint || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Predicted Boiling Point:</span>
                        <span class="molecule-card-property-value">${properties.boilingPoint || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Predicted Flash Point:</span>
                        <span class="molecule-card-property-value">${properties.flashPoint || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">Combustion Enthalpy:</span>
                        <span class="molecule-card-property-value">${properties.combustionEnthalpy || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">HOMO:</span>
                        <span class="molecule-card-property-value">${properties.homo || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">LUMO:</span>
                        <span class="molecule-card-property-value">${properties.lumo || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">ESP Max:</span>
                        <span class="molecule-card-property-value">${properties.espMax || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item">
                        <span class="molecule-card-property-label">ESP Min:</span>
                        <span class="molecule-card-property-value">${properties.espMin || '-'}</span>
                    </div>
                    <div class="molecule-card-property-item commercial-viability">
                        <span class="molecule-card-property-label">Commercial Viability:</span>
                        <span class="molecule-card-property-value">${properties.commercialViability || '-'}</span>
                    </div>
                </div>
                
                <!-- 可展开/收起的功能组信息栏 -->
                <div class="functional-groups-section">
                    <div class="functional-groups-header collapsed" onclick="window.moleculePanel.toggleFunctionalGroups(event)">
                        <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                        <span class="functional-groups-title">click to expand for more details</span>
                    </div>
                    <div class="functional-groups-content">
                        <h4>Functional Groups</h4>
                        <p>Ether, Ketal, Carbonate, Ester</p>
                    </div>
                </div>
                

            </div>
        `;
    }

    // 选择相似分子
    selectSimilarMolecule(molecule) {
        console.log('Selected similar molecule:', molecule.name);
        
        // 加载选中分子的详细信息
        this.showPanel(molecule.name);
    }

    // 获取相似分子数据
    getSimilarMolecules(originalMoleculeName, moleculeType = 'all') {
        // 模拟相似分子数据 - 包含完整参数
        const similarMolecules = {
            'TMSPi': [
                { 
                    name: 'TMSi', 
                    similarity: 95, 
                    properties: {
                        smiles: 'C[Si](C)(C)OP(=O)(C[Si](C)(C)O)C[Si](C)(C)O',
                        molecularWeight: '298.32 g/mol',
                        meltingPoint: '-12.5 °C',
                        boilingPoint: '228.5 °C',
                        flashPoint: '105.2 °C',
                        combustionEnthalpy: '-82.15 eV',
                        homo: '-7.42 eV',
                        lumo: '0.38 eV',
                        espMax: '0.68 eV',
                        espMin: '-1.79 eV',
                        commercialViability: 'Likely commercially available'
                    }
                },
                { 
                    name: 'TMSCl', 
                    similarity: 88, 
                    properties: {
                        smiles: 'C[Si](C)(C)Cl',
                        molecularWeight: '310.45 g/mol',
                        meltingPoint: '-8.2 °C',
                        boilingPoint: '235.1 °C',
                        flashPoint: '108.7 °C',
                        combustionEnthalpy: '-84.23 eV',
                        homo: '-7.38 eV',
                        lumo: '0.42 eV',
                        espMax: '0.71 eV',
                        espMin: '-1.76 eV',
                        commercialViability: 'Commercially available'
                    }
                },
                { 
                    name: 'TMSP', 
                    similarity: 82, 
                    properties: {
                        smiles: 'C[Si](C)(C)OP(=O)(C[Si](C)(C)O)C[Si](C)(C)O',
                        molecularWeight: '322.18 g/mol',
                        meltingPoint: '-5.8 °C',
                        boilingPoint: '242.3 °C',
                        flashPoint: '112.4 °C',
                        combustionEnthalpy: '-86.31 eV',
                        homo: '-7.51 eV',
                        lumo: '0.35 eV',
                        espMax: '0.65 eV',
                        espMin: '-1.82 eV',
                        commercialViability: 'Likely commercially available'
                    }
                },
                { 
                    name: 'TMSO', 
                    similarity: 78, 
                    properties: {
                        smiles: 'C[Si](C)(C)OSi(C)(C)C',
                        molecularWeight: '306.29 g/mol',
                        meltingPoint: '-15.2 °C',
                        boilingPoint: '219.7 °C',
                        flashPoint: '98.5 °C',
                        combustionEnthalpy: '-80.47 eV',
                        homo: '-7.29 eV',
                        lumo: '0.45 eV',
                        espMax: '0.74 eV',
                        espMin: '-1.71 eV',
                        commercialViability: 'Commercially available'
                    }
                },
                { 
                    name: 'TMSN', 
                    similarity: 75, 
                    properties: {
                        smiles: 'C[Si](C)(C)NSi(C)(C)C',
                        molecularWeight: '297.34 g/mol',
                        meltingPoint: '-3.4 °C',
                        boilingPoint: '248.9 °C',
                        flashPoint: '115.8 °C',
                        combustionEnthalpy: '-88.56 eV',
                        homo: '-7.63 eV',
                        lumo: '0.28 eV',
                        espMax: '0.58 eV',
                        espMin: '-1.89 eV',
                        commercialViability: 'Limited commercial availability'
                    }
                }
            ],
            'LiPF6': [
                { 
                    name: 'LiBF4', 
                    similarity: 92, 
                    properties: {
                        smiles: 'F[BF-](F)(F)F.[Li+]',
                        molecularWeight: '93.75 g/mol',
                        meltingPoint: '293°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.12 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Commercially available'
                    }
                },
                { 
                    name: 'LiClO4', 
                    similarity: 85, 
                    properties: {
                        smiles: 'O=Cl(=O)(=O)[O-].[Li+]',
                        molecularWeight: '106.39 g/mol',
                        meltingPoint: '236°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.08 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Commercially available'
                    }
                },
                { 
                    name: 'LiAsF6', 
                    similarity: 78, 
                    properties: {
                        smiles: 'F[As-](F)(F)(F)(F)F.[Li+]',
                        molecularWeight: '195.86 g/mol',
                        meltingPoint: '348°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.25 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Limited commercial availability'
                    }
                },
                { 
                    name: 'LiCF3SO3', 
                    similarity: 72, 
                    properties: {
                        smiles: 'FC(F)(F)S(=O)(=O)[O-].[Li+]',
                        molecularWeight: '156.01 g/mol',
                        meltingPoint: '500°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.31 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Commercially available'
                    }
                },
                { 
                    name: 'LiN(SO2CF3)2', 
                    similarity: 68, 
                    properties: {
                        smiles: 'FC(F)(F)S(=O)(=O)NS(=O)(=O)C(F)(F)F.[Li+]',
                        molecularWeight: '287.09 g/mol',
                        meltingPoint: '234°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.19 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Commercially available'
                    }
                }
            ],
            'LiFSI': [
                { 
                    name: 'LiTFSI', 
                    similarity: 94, 
                    properties: {
                        smiles: 'FC(F)(F)S(=O)(=O)NS(=O)(=O)C(F)(F)F.[Li+]',
                        molecularWeight: '287.09 g/mol',
                        meltingPoint: '234°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.19 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Commercially available'
                    }
                },
                { 
                    name: 'LiBETI', 
                    similarity: 87, 
                    properties: {
                        smiles: 'FC(F)(F)S(=O)(=O)NS(=O)(=O)C(F)(F)F.[Li+]',
                        molecularWeight: '301.12 g/mol',
                        meltingPoint: '245°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.22 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Commercially available'
                    }
                },
                { 
                    name: 'LiTDI', 
                    similarity: 81, 
                    properties: {
                        smiles: 'FC(F)(F)S(=O)(=O)NS(=O)(=O)C(F)(F)F.[Li+]',
                        molecularWeight: '295.08 g/mol',
                        meltingPoint: '238°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.15 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Limited commercial availability'
                    }
                },
                { 
                    name: 'LiPDI', 
                    similarity: 76, 
                    properties: {
                        smiles: 'FC(F)(F)S(=O)(=O)NS(=O)(=O)C(F)(F)F.[Li+]',
                        molecularWeight: '289.05 g/mol',
                        meltingPoint: '241°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.28 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Commercially available'
                    }
                },
                { 
                    name: 'LiTDI', 
                    similarity: 73, 
                    properties: {
                        smiles: 'FC(F)(F)S(=O)(=O)NS(=O)(=O)C(F)(F)F.[Li+]',
                        molecularWeight: '293.11 g/mol',
                        meltingPoint: '236°C',
                        boilingPoint: '分解',
                        flashPoint: 'N/A',
                        combustionEnthalpy: '-N/A',
                        homo: '-7.21 eV',
                        lumo: '-N/A',
                        espMax: '-N/A',
                        espMin: '-N/A',
                        commercialViability: 'Limited commercial availability'
                    }
                }
            ]
        };

        // 获取基础相似分子数据
        let baseSimilarMolecules = similarMolecules[originalMoleculeName] || [
            { 
                name: 'Similar 1', 
                similarity: 85, 
                properties: {
                    smiles: 'CCO',
                    molecularWeight: '150.0 g/mol',
                    meltingPoint: '25°C',
                    boilingPoint: '150°C',
                    flashPoint: '45°C',
                    combustionEnthalpy: '-65.0 eV',
                    homo: '-7.0 eV',
                    lumo: '0.5 eV',
                    espMax: '0.8 eV',
                    espMin: '-1.5 eV',
                    commercialViability: 'Commercially available'
                }
            },
            { 
                name: 'Similar 2', 
                similarity: 78, 
                properties: {
                    smiles: 'CCCO',
                    molecularWeight: '160.0 g/mol',
                    meltingPoint: '30°C',
                    boilingPoint: '160°C',
                    flashPoint: '50°C',
                    combustionEnthalpy: '-68.0 eV',
                    homo: '-7.2 eV',
                    lumo: '0.4 eV',
                    espMax: '0.7 eV',
                    espMin: '-1.6 eV',
                    commercialViability: 'Commercially available'
                }
            },
            { 
                name: 'Similar 3', 
                similarity: 72, 
                properties: {
                    smiles: 'CCCCO',
                    molecularWeight: '170.0 g/mol',
                    meltingPoint: '35°C',
                    boilingPoint: '170°C',
                    flashPoint: '55°C',
                    combustionEnthalpy: '-71.0 eV',
                    homo: '-7.4 eV',
                    lumo: '0.3 eV',
                    espMax: '0.6 eV',
                    espMin: '-1.7 eV',
                    commercialViability: 'Limited commercial availability'
                }
            },
            { 
                name: 'Similar 4', 
                similarity: 68, 
                properties: {
                    smiles: 'CCCCCO',
                    molecularWeight: '180.0 g/mol',
                    meltingPoint: '40°C',
                    boilingPoint: '180°C',
                    flashPoint: '60°C',
                    combustionEnthalpy: '-74.0 eV',
                    homo: '-7.6 eV',
                    lumo: '0.2 eV',
                    espMax: '0.5 eV',
                    espMin: '-1.8 eV',
                    commercialViability: 'Limited commercial availability'
                }
            },
            { 
                name: 'Similar 5', 
                similarity: 65, 
                properties: {
                    smiles: 'CCCCCCO',
                    molecularWeight: '190.0 g/mol',
                    meltingPoint: '45°C',
                    boilingPoint: '190°C',
                    flashPoint: '65°C',
                    combustionEnthalpy: '-77.0 eV',
                    homo: '-7.8 eV',
                    lumo: '0.1 eV',
                    espMax: '0.4 eV',
                    espMin: '-1.9 eV',
                    commercialViability: 'Limited commercial availability'
                }
            }
        ];

        // 根据分子类型过滤相似分子
        if (moleculeType === 'all') {
            // 返回所有类型的相似分子
            return baseSimilarMolecules;
        } else {
            // 根据分子类型过滤（这里可以根据实际需求调整过滤逻辑）
            // 目前返回所有分子，但可以根据分子类型添加不同的过滤条件
            return baseSimilarMolecules.filter(molecule => {
                // 这里可以添加基于分子类型的过滤逻辑
                // 例如：根据分子的属性、结构特征等进行分类
                return true; // 暂时返回所有分子
            });
        }
    }



    // 切换功能组信息栏
    toggleFunctionalGroups(event) {
        // 获取被点击的header元素
        const header = event ? event.currentTarget : document.querySelector('.functional-groups-header');
        const content = header.nextElementSibling;
        const chevron = header.querySelector('.chevron-icon');
        const title = header.querySelector('.functional-groups-title');
        
        if (header.classList.contains('collapsed')) {
            // 展开
            header.classList.remove('collapsed');
            header.classList.add('expanded');
            content.style.display = 'block';
            chevron.style.transform = 'rotate(180deg)';
            title.textContent = 'click to collapse';
        } else {
            // 收起
            header.classList.remove('expanded');
            header.classList.add('collapsed');
            content.style.display = 'none';
            chevron.style.transform = 'rotate(0deg)';
            title.textContent = 'click to expand for more details';
        }
    }

    // 切换到mini模式
    switchToMiniMode() {
        // 检查是否存在sidebar实例
        if (window.sidebarInstance && typeof window.sidebarInstance.switchToMiniMode === 'function') {
            window.sidebarInstance.switchToMiniMode();
        } else {
            // 备用方案：直接操作DOM
            const sidebar = document.querySelector('.chat-sidebar');
            const chatContainer = document.querySelector('.chat-container');
            
            if (sidebar && chatContainer) {
                // 添加mini模式的CSS类
                chatContainer.classList.add('sidebar-mini');
                sidebar.classList.add('mini');
                
                // 隐藏侧边栏内容，只显示图标
                const sidebarContent = sidebar.querySelectorAll('.sidebar-content, .sidebar-menu, .sidebar-footer');
                sidebarContent.forEach(element => {
                    if (element) {
                        element.style.display = 'none';
                    }
                });
                
                // 显示mini模式的图标
                const miniIcons = sidebar.querySelectorAll('.mini-icon');
                miniIcons.forEach(icon => {
                    if (icon) {
                        icon.style.display = 'block';
                    }
                });
            }
        }
    }

    // 恢复到完整模式
    switchToFullMode() {
        // 检查是否存在sidebar实例
        if (window.sidebarInstance && typeof window.sidebarInstance.switchToFullMode === 'function') {
            window.sidebarInstance.switchToFullMode();
        } else {
            // 备用方案：直接操作DOM
            const sidebar = document.querySelector('.chat-sidebar');
            const chatContainer = document.querySelector('.chat-container');
            
            if (sidebar && chatContainer) {
                // 移除mini模式的CSS类
                chatContainer.classList.remove('sidebar-mini');
                sidebar.classList.remove('mini');
                
                // 显示侧边栏内容
                const sidebarContent = sidebar.querySelectorAll('.sidebar-content, .sidebar-menu, .sidebar-footer');
                sidebarContent.forEach(element => {
                    if (element) {
                        element.style.display = 'block';
                    }
                });
                
                // 隐藏mini模式的图标
                const miniIcons = sidebar.querySelectorAll('.mini-icon');
                miniIcons.forEach(icon => {
                    if (icon) {
                        icon.style.display = 'none';
                    }
                });
            }
        }
    }
}

// 导出模块
window.MoleculePanel = MoleculePanel;