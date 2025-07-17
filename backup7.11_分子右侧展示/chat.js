document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const chatMessages = document.getElementById('chat-messages');
  const newChatBtn = document.querySelector('.new-chat-btn');
  const historyNav = document.querySelector('.history-nav ul');
  const sidebar = document.getElementById('chatSidebar');
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  const chatContainer = document.querySelector('.chat-container');
  const miniSidebar = document.getElementById('miniSidebar');
  const expandSidebarBtn = document.getElementById('expandSidebarBtn');
  const miniNewChatBtn = document.getElementById('miniNewChatBtn');
  const rightFloatPanel = document.getElementById('rightFloatPanel');
  const chatMain = document.getElementById('chatMain');

  // 插入系统欢迎语
  function insertBotMessage(text) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper bot';
    const msg = document.createElement('div');
    msg.className = 'message';
    msg.textContent = text;
    wrapper.appendChild(msg);
    chatMessages.appendChild(wrapper);
  }

  function insertUserMessage(text) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper user';
    const msg = document.createElement('div');
    msg.className = 'message';
    msg.textContent = text;
    wrapper.appendChild(msg);
    chatMessages.appendChild(wrapper);
  }

  // 发送按钮状态切换
  function updateBtnState() {
    if (input.value.trim().length > 0) {
      sendBtn.classList.add('enabled');
      sendBtn.disabled = false;
    } else {
      sendBtn.classList.remove('enabled');
      sendBtn.disabled = true;
    }
  }
  input.addEventListener('input', updateBtnState);
  updateBtnState();

  // 发送消息
  sendBtn.addEventListener('click', function() {
    if (input.value.trim().length > 0) {
      insertUserMessage(input.value.trim());
      // 检查是否为"分子探索"
      if (input.value.trim() === '分子探索') {
        // 收起sidebar
        sidebar.classList.add('collapsed');
        chatContainer.classList.add('sidebar-collapsed');
        miniSidebar.style.display = 'flex';
        // 压缩主内容区，显示右侧浮窗
        chatContainer.classList.add('shrink-main');
        rightFloatPanel.style.display = 'block';
      }
      input.value = '';
      updateBtnState();
      // 系统自动回复
      insertBotMessage('test context');
    }
  });

  // 回车发送
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  // 新对话按钮逻辑
  if (newChatBtn) {
    newChatBtn.addEventListener('click', function() {
      // 提取第一个用户问题
      const firstUserMsg = chatMessages.querySelector('.message-wrapper.user .message');
      if (firstUserMsg && historyNav) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = firstUserMsg.textContent.length > 32 ? firstUserMsg.textContent.slice(0, 32) + '...' : firstUserMsg.textContent;
        li.appendChild(a);
        historyNav.insertBefore(li, historyNav.firstChild);
      }
      // 清空对话区
      chatMessages.innerHTML = '';
      // 插入系统欢迎语
      insertBotMessage('Welcome to the Molecular Universe. How can I help you today?');
    });
  }

  // 页面加载时插入欢迎语
  insertBotMessage('Welcome to the Molecular Universe. How can I help you today?');

  if (toggleSidebarBtn && sidebar && chatContainer) {
    toggleSidebarBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      chatContainer.classList.toggle('sidebar-collapsed');
      // mini sidebar显示
      if (chatContainer.classList.contains('sidebar-collapsed')) {
        miniSidebar.style.display = 'flex';
      } else {
        miniSidebar.style.display = 'none';
      }
    });
  }
  if (expandSidebarBtn && sidebar && chatContainer) {
    expandSidebarBtn.addEventListener('click', function() {
      sidebar.classList.remove('collapsed');
      chatContainer.classList.remove('sidebar-collapsed');
      miniSidebar.style.display = 'none';
    });
  }
  // mini sidebar的New Chat按钮
  if (miniNewChatBtn) {
    miniNewChatBtn.addEventListener('click', function() {
      if (typeof newChatBtn !== 'undefined' && newChatBtn) {
        newChatBtn.click();
      }
    });
  }
}); 