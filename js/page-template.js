// 页面模板系统 - 用于生成标准化的页面结构
const PageTemplate = {
    // 生成完整的页面HTML
    generatePage: function(options) {
        const {
            title,
            currentPage,
            bodyClass = '',
            additionalCSS = [],
            additionalJS = [],
            content
        } = options;

        const cssLinks = additionalCSS.map(css => `<link rel="stylesheet" href="${css}">`).join('\n    ');
        const jsScripts = additionalJS.map(js => `<script src="${js}"></script>`).join('\n    ');

        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="style.css">
    ${cssLinks}
</head>
<body class="${bodyClass}">
    <!-- Header will be injected by components.js -->
    <div id="header-container"></div>
    
    <!-- Page specific content -->
    ${content}
    
    <!-- Settings modal will be injected by components.js -->
    <div id="settings-modal-container"></div>

    <!-- Scripts -->
    <script src="js/components.js"></script>
    <script src="js/page-template.js"></script>
    <script src="js/base.js"></script>
    <script src="js/settings-modal.js"></script>
    ${jsScripts}
    <script>
        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            PageTemplate.initializePage('${currentPage}');
        });
    </script>
</body>
</html>`;
    },

    // 初始化页面
    initializePage: function(currentPage) {
        // 渲染通用组件
        this.renderCommonComponents();
        
        // 设置导航激活状态
        setActiveNavigation(currentPage);
        
        // 调用页面特定的初始化函数
        if (window[`initialize${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}Page`]) {
            window[`initialize${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}Page`]();
        }
    },

    // 渲染通用组件
    renderCommonComponents: function() {
        // 渲染header
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            renderComponent('header', headerContainer);
        }

        // 渲染设置弹窗
        const settingsContainer = document.getElementById('settings-modal-container');
        if (settingsContainer) {
            renderComponent('settingsModal', settingsContainer);
        }
    }
};

// 页面配置
const PageConfigs = {
    map: {
        title: 'Map - Molecular Universe',
        currentPage: 'map',
        bodyClass: 'map-page-body',
        additionalCSS: ['css/map.css', 'css/settings-modal.css'],
        additionalJS: ['map.js'],
        content: `
    <div class="page-content">
        <div class="column-left">
            <img src="mu-map-cluster.png" alt="Molecular Universe Cluster Map" class="main-map-img">
        </div>
        <div class="column-right">
            <div class="scrollable-module">
                <h3>About Molecular Universe</h3>
                <p>Molecular Universe MU-0 is a battery material discovery software and service platform. We mapped more battery relevant properties of more battery relevant small molecules than ever before and trained a navigation system powered by a battery-specific llm that's like having world-renowned battery scientists at your fingertips. Now we can offer different levels of joint development services to customers across Li-Metal, silicon Li-ion, LFP, and many others.</p>
                <p>This 2D map visualizes a 512 dimensional universe of small molecules through a dimension reduction algorithm called UMAP (Uniform Manifold Approximation and Projection). It's the world's largest database of battery relevant molecules and properties that we know of, and constantly growing. Users can interact, filter, search and ask questions in natural language to accelerate their next generation battery development.</p>
                <p>In MU-0, the map consists of 23 molecular clusters, they are labeled as below. We will be updating this map as we explore deeper into the Molecular Universe.</p>
                <img src="cluster-map-upload.png" alt="Molecular Universe Cluster Map" style="width:100%;margin-top:16px;" />
                <p>Cluster 0 is characterized by Sulfone, Alkyne, NitroSulfonylFluoride functional groups.</p>
                <p>Cluster 1 is characterized by Heterocyclic-P-CO-1, Amide, Amine functional groups.</p>
                <p>Cluster 2 is characterized by Heterocyclic-P-CS-1, Amide, Amine functional groups.</p>
                <p>Cluster 3 is characterized by FluoroSulfonyl, Sulfone, Alkene functional groups.</p>
                <p>Cluster 4 is characterized by Ether, Heterocyclic-P-CN-2, Thioketone functional groups.</p>
                <p>Cluster 5 is characterized by Pyridine, Ketone, Thioketone functional groups.</p>
                <p>Cluster 6 is characterized by Heterocyclic-P-CS-1, Amide, Amine functional groups.</p>
                <p>Cluster 7 is characterized by Heterocyclic-P-CO-1, Amide, Thioamide functional groups.</p>
                <p>Cluster 8 is characterized by Sulfone, Amide, FluoroSulfonyl functional groups.</p>
                <p>Cluster 9 is characterized by Amino carbonyl, Imide, Amine functional groups.</p>
                <p>Cluster 10 is characterized by Amine, Ether, Ketal functional groups.</p>
                <p>Cluster 11 is characterized by Arene, Amide, Halogen functional groups.</p>
                <p>Cluster 12 is characterized by Arene, Ketal, Ether functional groups.</p>
                <p>Cluster 13 is characterized by Amide, Amine, Heterocyclic-P-CO-1 functional groups.</p>
                <p>Cluster 14 is characterized by Amide, Amine, Alkene functional groups.</p>
                <p>Cluster 15 is characterized by Amide, Amine, Disulfide functional groups.</p>
                <p>Cluster 16 is characterized by Amine, Amide, Heterocyclic-P-CO-1 functional groups.</p>
                <p>Cluster 17 is characterized by Sulfonate ester, Sulfone, BoronicAcid functional groups. (This cluster contains DTD.)</p>
                <p>Cluster 18 is characterized by Arene, Amide, Halogen functional groups.</p>
                <p>Cluster 19 is characterized by Ketone, Sulfone, Halogen functional groups. (This cluster contains EC, PC, FEC, DEC, DMC, DME, and F5DEE.)</p>
                <p>Cluster 20 is characterized by Amide, Amine, Heterocyclic-P-CO-1 functional groups.</p>
                <p>Cluster 21 is characterized by Heterocyclic-P-CO-1, Ketone, Heterocyclic-P-CS-1 functional groups.</p>
                <p>Cluster 22 is characterized by Arene, Imide, Amide functional groups.</p>
                <p>Cluster 23 is characterized by Amine, Nitro, Pyridine functional groups.</p>
                <p>Cluster 24 is characterized by Amide, Amine, Ether functional groups.</p>
            </div>
        </div>
    </div>`
    },

    ask: {
        title: 'Ask - Molecular Universe',
        currentPage: 'ask',
        bodyClass: 'map-page-body',
        additionalCSS: ['css/settings-modal.css'],
        additionalJS: ['ask.js'],
        content: `
    <div class="page-content">
        <div class="column-left">
            <img src="mu-map-cluster.png" alt="Molecular Universe Cluster Map" class="main-map-img">
        </div>
        <div class="column-right">
            <div class="scrollable-module">
                <h3>About Molecular Universe</h3>
                <p>Molecular Universe MU-0 is a battery material discovery software and service platform. We mapped more battery relevant properties of more battery relevant small molecules than ever before and trained a navigation system powered by a battery-specific llm that's like having world-renowned battery scientists at your fingertips. Now we can offer different levels of joint development services to customers across Li-Metal, silicon Li-ion, LFP, and many others.</p>
                <p>This 2D map visualizes a 512 dimensional universe of small molecules through a dimension reduction algorithm called UMAP (Uniform Manifold Approximation and Projection). It's the world's largest database of battery relevant molecules and properties that we know of, and constantly growing. Users can interact, filter, search and ask questions in natural language to accelerate their next generation battery development.</p>
                <p>In MU-0, the map consists of 23 molecular clusters, they are labeled as below. We will be updating this map as we explore deeper into the Molecular Universe.</p>
                <img src="mu-map-cluster.png" alt="Molecular Universe Cluster Map" class="cluster-map-img">
                <div class="cluster-descriptions">
                    <h4>Cluster Details</h4>
                    <p>Cluster 0 is characterized by Sulfone, Alkyne, NitroSulfonylFluoride functional groups.</p>
                    <p>Cluster 1 is characterized by Heterocyclic-P-CO-1, Amide, Amine functional groups.</p>
                    <p>Cluster 2 is characterized by Heterocyclic-P-CS-1, Amide, Amine functional groups.</p>
                    <p>Cluster 3 is characterized by FluoroSulfonyl, Sulfone, Alkene functional groups.</p>
                    <p>Cluster 4 is characterized by Ether, Heterocyclic-P-CN-2, Thioketone functional groups.</p>
                    <p>Cluster 5 is characterized by Pyridine, Ketone, Thioketone functional groups.</p>
                    <p>Cluster 6 is characterized by Heterocyclic-P-CS-1, Amide, Amine functional groups.</p>
                    <p>Cluster 7 is characterized by Heterocyclic-P-CO-1, Amide, Thioamide functional groups.</p>
                    <p>Cluster 8 is characterized by Sulfone, Amide, FluoroSulfonyl functional groups.</p>
                    <p>Cluster 9 is characterized by Amino carbonyl, Imide, Amine functional groups.</p>
                    <p>Cluster 10 is characterized by Amine, Ether, Ketal functional groups.</p>
                    <p>Cluster 11 is characterized by Arene, Amide, Halogen functional groups.</p>
                    <p>Cluster 12 is characterized by Arene, Ketal, Ether functional groups.</p>
                    <p>Cluster 13 is characterized by Amide, Amine, Heterocyclic-P-CO-1 functional groups.</p>
                    <p>Cluster 14 is characterized by Amide, Amine, Alkene functional groups.</p>
                    <p>Cluster 15 is characterized by Amide, Amine, Disulfide functional groups.</p>
                    <p>Cluster 16 is characterized by Amine, Amide, Heterocyclic-P-CO-1 functional groups.</p>
                    <p>Cluster 17 is characterized by Sulfonate ester, Sulfone, BoronicAcid functional groups. (This cluster contains DTD.)</p>
                    <p>Cluster 18 is characterized by Arene, Amide, Halogen functional groups.</p>
                    <p>Cluster 19 is characterized by Ketone, Sulfone, Halogen functional groups. (This cluster contains EC, PC, FEC, DEC, DMC, DME, and F5DEE.)</p>
                    <p>Cluster 20 is characterized by Amide, Amine, Heterocyclic-P-CO-1 functional groups.</p>
                    <p>Cluster 21 is characterized by Heterocyclic-P-CO-1, Ketone, Heterocyclic-P-CS-1 functional groups.</p>
                    <p>Cluster 22 is characterized by Arene, Imide, Amide functional groups.</p>
                    <p>Cluster 23 is characterized by Amine, Nitro, Pyridine functional groups.</p>
                    <p>Cluster 24 is characterized by Amide, Amine, Ether functional groups.</p>
                </div>
            </div>
        </div>
    </div>`
    }
    ,
    predictionTool: {
        title: 'Prediction · 早期生命预测工具 Beta',
        currentPage: 'prediction',
        bodyClass: 'prediction-tool-page',
        additionalCSS: [],
        additionalJS: [],
        content: `
    <div class="page-content" style="padding:0; margin:0; height:100vh; display:flex; flex-direction:column;">
      <!-- 自定义标题区域 -->
      <div class="custom-title-bar" style="background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 16px 24px; z-index: 1000; position: relative;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
          电池早期生命预测工具
          <span class="beta-badge" style="background: #e8f5e8; color: #56B26A; font-size: 10px; font-weight: 500; padding: 2px 6px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.3px; line-height: 1; border: 1px solid #d1e7d1; display: inline-block;">Beta</span>
        </h1>
      </div>
      <!-- iframe容器 -->
      <div style="flex:1; position:relative; width:100%; min-height:0; margin-top: -1px;">
        <iframe src="early-life-tool/index.html?embed=1" title="早期生命预测工具 Beta" style="position:absolute; inset:0; width:100%; height:100%; border:0; background:#fff; display:block;"></iframe>
      </div>
    </div>`
    }
}; 