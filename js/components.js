// 组件系统 - 用于管理可复用的 HTML 组件
const Components = {
    // 导航栏组件
    header: `
        <header class="main-header">
            <div class="logo-container">
                <img src="logo.png" alt="SES Logo" class="logo-img">
            </div>
            <nav class="main-nav">
                <a href="map.html" class="nav-item" data-page="map">Map</a>
                <a href="chat.html" class="nav-item" data-page="ask">Ask</a>
                <a href="#" class="nav-item">Search</a>
                <a href="#" class="nav-item">Filter</a>
                <a href="#" class="nav-item">Favourites</a>
                <div class="nav-item dropdown">
                    <a href="#" class="nav-item" data-page="prediction">Prediction</a>
                    <div class="dropdown-menu">
                        <div class="dropdown-row">
                            <a href="battery-prediction.html" class="dropdown-item">Battery System Selection</a>
                            <a href="early-life-prediction.html" class="dropdown-item">早期生命预测</a>
                            <a href="early-life-prediction2.html" class="dropdown-item">早期生命预测2</a>
                            <a href="prediction-tool.html" class="dropdown-item">早期生命预测工具 <span class="beta-badge">Beta</span></a>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="user-actions">
                <a href="about.html" class="nav-item" target="_blank" rel="noopener noreferrer">About ↗</a>
                <div class="user-avatar-container">
                    <a href="#" class="action-icon user-avatar" id="userAvatar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24px" height="24px">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </a>
                    <div class="user-dropdown" id="userDropdown">
                        <div class="user-info">
                            <div class="user-avatar-large">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="36px" height="36px">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div class="user-details">
                                <div class="user-name-container">
                                    <div class="user-email">Yuhe.Chen@ses.ai</div>
                                    <span class="subscription-badge">Explorer</span>
                                </div>
                            </div>
                        </div>
                        <a href="#" class="dropdown-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="item-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            账号设置
                        </a>
                        <a href="#" class="dropdown-item" id="logoutButton">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="item-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                            退出登录
                        </a>
                    </div>
                </div>
            </div>
        </header>
    `,

    // 设置弹窗组件
    settingsModal: `
        <div class="settings-modal modal" id="settingsModal">
            <div class="settings-modal-content">
                <div class="settings-modal-sidebar">
                    <button class="settings-tab active" data-tab="account">账号管理</button>
                    <button class="settings-tab" data-tab="subscription">订阅管理</button>
                    <button class="settings-tab" data-tab="preference">偏好设置</button>
                </div>
                <div class="settings-modal-main">
                    <div class="settings-panel" data-panel="account">
                        <div class="user-info-card" style="box-shadow:none; margin-bottom:32px;">
                            <div class="user-info-left">
                                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Lucy" class="user-avatar-large-img" alt="用户头像">
                                <div class="user-info-meta">
                                    <div class="user-info-name-wrapper">
                                        <div class="user-info-name">Yuhe.Chen</div>
                                        <span class="subscription-badge">Explorer</span>
                                    </div>
                                    <div class="user-info-registered">注册时间: 2012-10-16 23:55:35</div>
                                </div>
                            </div>
                        </div>
                        <div class="settings-card">
                            <div class="settings-group-title">账号信息</div>
                            <div class="settings-item">
                                <div class="settings-item-main">
                                    <div class="settings-item-title">姓名</div>
                                </div>
                                <div class="settings-item-action">Yuhe.Chen <a href="#" class="settings-link">修改</a></div>
                            </div>
                            <div class="settings-item">
                                <div class="settings-item-main">
                                    <div class="settings-item-title">注册邮箱</div>
                                </div>
                                <div class="settings-item-action">Yuhe.Chen@ses.ai <a href="#" class="settings-link">修改</a></div>
                            </div>
                            <div class="settings-item">
                                <div class="settings-item-main">
                                    <div class="settings-item-title">修改密码</div>
                                </div>
                                <div class="settings-item-action"><a href="#" class="settings-link">修改</a></div>
                            </div>
                        </div>
                    </div>
                    <div class="settings-panel" data-panel="subscription" style="display:none;">
                        <div class="settings-card">
                            <div class="settings-group-title">订阅状态</div>
                            <div class="settings-item">
                                <div class="settings-item-main">
                                    <div class="settings-item-title">当前套餐</div>
                                </div>
                                <div class="settings-item-action"><span class="subscription-badge">Explorer</span></div>
                            </div>
                            <div class="settings-item">
                                <div class="settings-item-main">
                                    <div class="settings-item-title">有效期</div>
                                </div>
                                <div class="settings-item-action">2025-12-31</div>
                            </div>
                        </div>
                        <div class="settings-card">
                            <div class="settings-group-title">教育验证</div>
                            <div class="settings-item">
                                <div class="settings-item-main">
                                    <div class="settings-item-title">是否教育账号</div>
                                </div>
                                <div class="settings-item-action">否 <a href="#" id="verifyEduBtn" class="btn btn-secondary" style="margin-left: 12px;">验证教育身份</a></div>
                            </div>
                        </div>
                    </div>
                    <div class="settings-panel" data-panel="preference" style="display:none;">
                        <div class="settings-card">
                            <div class="settings-group-title">界面与语言</div>
                            <div class="settings-item">
                                <div class="settings-item-main">
                                    <div class="settings-item-title">语言</div>
                                    <div class="settings-item-desc">更改用户界面的语言。</div>
                                </div>
                                <div class="settings-item-action">
                                    <select class="lang-select">
                                        <option>中文</option>
                                        <option>English (US)</option>
                                        <option>한국어</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <span class="settings-modal-close close-btn" aria-label="关闭" tabindex="0" style="background:none; border:none; box-shadow:none; width:32px; height:32px; display:flex; align-items:center; justify-content:center; padding:0;">
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <line x1="6" y1="6" x2="18" y2="18" stroke="#bbb" stroke-width="2" stroke-linecap="round"/>
                        <line x1="18" y1="6" x2="6" y2="18" stroke="#bbb" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </span>
            </div>
        </div>
    `
};

// 组件渲染函数
function renderComponent(componentName, targetElement) {
    if (Components[componentName] && targetElement) {
        targetElement.innerHTML = Components[componentName];
        return true;
    }
    return false;
}

// 设置当前页面的导航激活状态
function setActiveNavigation(currentPage) {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
} 