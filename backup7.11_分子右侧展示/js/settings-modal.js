// 设置弹窗相关JS逻辑
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // 账号设置弹窗逻辑
    const settingsModal = document.getElementById('settingsModal');
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsPanels = document.querySelectorAll('.settings-panel');
    const settingsClose = document.querySelector('.settings-modal-close');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const userDropdown = document.getElementById('userDropdown');
    // 兼容所有页面：为文本内容为"账号设置"的下拉项绑定弹窗
    dropdownItems.forEach(item => {
      if (item.textContent.replace(/\s/g, '').includes('账号设置')) {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          if(userDropdown) userDropdown.classList.remove('show');
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
    // 教育验证弹窗逻辑
    const eduModal = document.getElementById('educationVerificationModal');
    const verifyEduBtn = document.getElementById('verifyEduBtn');
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
    // 教育验证弹窗切换逻辑
    const eduVerifyBtn = document.getElementById('verifyEduBtn');
    const eduPanel = document.querySelector('.settings-panel[data-panel="edu-verification"]');
    const subPanel = document.querySelector('.settings-panel[data-panel="subscription"]');
    const eduBackBtn = document.querySelector('.edu-back-btn');
    if (eduVerifyBtn && eduPanel && subPanel) {
      eduVerifyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.settings-panel').forEach(p => p.style.display = 'none');
        eduPanel.style.display = '';
      });
    }
    if (eduBackBtn && eduPanel && subPanel) {
      eduBackBtn.addEventListener('click', function() {
        document.querySelectorAll('.settings-panel').forEach(p => p.style.display = 'none');
        subPanel.style.display = '';
      });
    }
    // 退出登录跳转到首页
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/index.html';
      });
    }
  });
})(); 