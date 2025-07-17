document.addEventListener('DOMContentLoaded', function() {
    // Features section tab switcher for about.html
    if (document.querySelector('.features-list')) {
        document.querySelectorAll('.feature-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active from all tabs
                document.querySelectorAll('.feature-tab').forEach(t => t.classList.remove('active'));
                // Hide all details
                document.querySelectorAll('.feature-detail').forEach(d => d.style.display = 'none');
                // Activate this tab
                this.classList.add('active');
                // Show corresponding detail
                const key = this.getAttribute('data-feature');
                const detail = document.querySelector('.feature-detail[data-feature="' + key + '"]');
                if (detail) detail.style.display = '';
            });
        });
    }

    // 获取所有下拉菜单项
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // 账号设置弹窗逻辑
    const settingsModal = document.getElementById('settingsModal');
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsPanels = document.querySelectorAll('.settings-panel');
    const settingsClose = document.querySelector('.settings-modal-close');
    // 兼容所有页面：为文本内容为"账号设置"的下拉项绑定弹窗
    dropdownItems.forEach(item => {
        if (item.textContent.replace(/\s/g, '').includes('账号设置')) {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                settingsModal.classList.add('show');
            });
        }
    });
    // 关闭弹窗
    if (settingsClose) {
        settingsClose.addEventListener('click', () => {
            settingsModal.classList.remove('show');
        });
    }
    // 点击遮罩关闭弹窗
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('show');
            }
        });
    }
    // 分组切换
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            settingsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const tabKey = this.getAttribute('data-tab');
            settingsPanels.forEach(panel => {
                if (panel.getAttribute('data-panel') === tabKey) {
                    panel.style.display = '';
                } else {
                    panel.style.display = 'none';
                }
            });
        });
    });

    // Education Verification Modal Logic
    const eduModal = document.getElementById('educationVerificationModal');
    const verifyEduBtn = document.getElementById('verifyEduBtn');
    // Important: querySelector inside the modal to avoid conflicts
    const closeBtn = eduModal ? eduModal.querySelector('.close-btn') : null;

    if (eduModal && verifyEduBtn && closeBtn) {
        verifyEduBtn.addEventListener('click', function(e) {
            e.preventDefault();
            eduModal.style.display = 'block';
        });

        closeBtn.addEventListener('click', function() {
            eduModal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target == eduModal) {
                eduModal.style.display = 'none';
            }
        });
    }

    // 教育验证弹窗切换逻辑（修复：订阅管理和教育验证面板不在同一父级时，需全局查找并切换）
    const eduVerifyBtn = document.getElementById('verifyEduBtn');
    const eduPanel = document.querySelector('.settings-panel[data-panel="edu-verification"]');
    const subPanel = document.querySelector('.settings-panel[data-panel="subscription"]');
    const eduBackBtn = document.querySelector('.edu-back-btn');
    if (eduVerifyBtn && eduPanel && subPanel) {
        eduVerifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // 隐藏所有 settings-panel
            document.querySelectorAll('.settings-panel').forEach(p => p.style.display = 'none');
            eduPanel.style.display = '';
        });
    }
    if (eduBackBtn && eduPanel && subPanel) {
        eduBackBtn.addEventListener('click', function() {
            // 隐藏所有 settings-panel
            document.querySelectorAll('.settings-panel').forEach(p => p.style.display = 'none');
            subPanel.style.display = '';
        });
    }

    // 弹窗显示/关闭逻辑
    const modal = document.getElementById('moleculeModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => { 
        console.log('关闭按钮被点击');
        modal.style.display = 'none'; 
      });
    }
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') modal.style.display = 'none';
    });
    modal.onclick = e => {
      if (e.target === modal) modal.style.display = 'none';
    };

    // 页面加载后弹窗默认隐藏
    if (modal) {
      modal.style.display = 'none';
    }

    // 示例：点击左侧分子图片区域弹出弹窗
    const leftImg = document.querySelector('.main-map-img');
    if (leftImg) {
      leftImg.style.cursor = 'pointer';
      leftImg.onclick = () => {
        // 这里可根据实际分子数据动态填充内容
        document.getElementById('modalMoleculeImg').src = 'molecule-structure.png';
        document.getElementById('modalSmiles').textContent = 'CCOC[C@H]1CN(S(=O)=O)CC(F)F)CCO1';
        document.getElementById('modalUmap').textContent = 'X: 1.98, Y: 18.56';
        document.getElementById('modalMw').textContent = '273.30';
        document.getElementById('modalHomo').textContent = '-7.14';
        document.getElementById('modalLumo').textContent = '0.22';
        document.getElementById('modalMinEsp').textContent = '-1.57';
        document.getElementById('modalMaxEsp').textContent = '1.76';
        document.getElementById('modalGroups').textContent = '["Halide","Ether","FluoroAlkyl_SP3"]';
        document.getElementById('modalMp').textContent = '60.74';
        document.getElementById('modalBp').textContent = '127.44';
        document.getElementById('modalFp').textContent = '120.88';
        document.getElementById('modalFormula').textContent = 'C9H17F2NO4S';
        document.getElementById('modalEnthalpy').textContent = '-67.27';
        document.getElementById('modalViability').textContent = 'Likely synthesizable but probably not commercially available';
        modal.style.display = 'flex';
      };
    }

    // 测试按钮强制弹窗
    const testBtn = document.getElementById('testShowModalBtn');
    if (testBtn && modal) {
      testBtn.onclick = () => {
        document.getElementById('modalMoleculeImg').src = 'molecule-structure.png';
        modal.style.display = 'flex';
      };
    }
}); 