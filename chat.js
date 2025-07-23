document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const chatMessages = document.getElementById('chat-messages');
  const newChatBtn = document.querySelector('.new-chat-btn');
  const historyNav = document.querySelector('.history-nav ul');
  const sidebar = document.getElementById('chatSidebar');
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  const chatContainer = document.querySelector('.chat-container');
  const chatMain = document.getElementById('chatMain');

  // 插入系统欢迎语
  function insertBotMessage(text, showRegenerate = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper bot';
    const msg = document.createElement('div');
    msg.className = 'message';
    
    // 处理化学分子，使其可点击
    const processedText = text.replace(/(LiPF6|LiFSI|EC|DEC|DMC|EMC|VC|FEC|LiF|Li2CO3|Li2O|Al2O3|ZrO2|HF)/g, '<span class="chemical-molecule" data-molecule="$1">$1</span>');
    msg.innerHTML = processedText;
    
    // 为化学分子添加点击事件
    const molecules = msg.querySelectorAll('.chemical-molecule');
    molecules.forEach(molecule => {
      molecule.addEventListener('click', function() {
        const moleculeName = this.getAttribute('data-molecule');
        console.log('Clicked molecule:', moleculeName);
        
        // 显示分子详情浮层
        showMoleculePanel(moleculeName);
        
        // 视觉反馈
        this.style.backgroundColor = '#e8f5e8';
        setTimeout(() => {
          this.style.backgroundColor = '';
        }, 500);
      });
    });
    
    // 创建操作按钮容器
    const actionButtons = document.createElement('div');
    actionButtons.className = 'message-actions';
    
    // 复制按钮
    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn copy-btn';
    copyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <rect x="4" y="4" width="12" height="16" rx="2" stroke="currentColor" fill="none"/>
        <rect x="8" y="8" width="12" height="16" rx="2" stroke="currentColor" fill="none"/>
      </svg>
    `;
    copyBtn.title = '复制';
    
    // 添加点击事件
    copyBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(text).then(() => {
        // 保存原始图标
        const originalIcon = this.innerHTML;
        
        // 显示复制成功提示 - 更换为对号图标
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        `;
        this.style.color = '#56B26A';
        
        // 3秒后恢复为复制图标
        setTimeout(() => {
          this.innerHTML = originalIcon;
          this.style.color = '#6b7280';
        }, 3000);
      });
    });
    
    actionButtons.appendChild(copyBtn);
    
    // 只有最新回复才显示重新生成按钮
    if (showRegenerate) {
      const regenerateBtn = document.createElement('button');
      regenerateBtn.className = 'action-btn regenerate-btn';
      regenerateBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      `;
      regenerateBtn.title = '重新生成';
      
      regenerateBtn.addEventListener('click', function() {
        // 重新生成逻辑
        console.log('Regenerating response...');
        // 这里可以添加重新生成的逻辑
      });
      
      actionButtons.appendChild(regenerateBtn);
    }
    
    wrapper.appendChild(msg);
    wrapper.appendChild(actionButtons);
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

  // 插入带按钮的系统消息
  function insertBotMessageWithButton(text, buttonText) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper bot';
    const msg = document.createElement('div');
    msg.className = 'message';
    msg.textContent = text;
    
    // 创建按钮
    const button = document.createElement('button');
    button.className = 'molecule-btn';
    button.textContent = buttonText;
    button.style.cssText = `
      margin-top: 10px;
      padding: 8px 16px;
      background-color: #56B26A;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    `;
    
    // 按钮点击事件
    button.addEventListener('click', function() {
      console.log('分子按钮被点击');
      // 这里可以添加按钮点击后的逻辑
    });
    
    // 按钮悬停效果
    button.addEventListener('mouseenter', function() {
      this.style.backgroundColor = '#4a9d5';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.backgroundColor = '#56B26';
    });
    
    msg.appendChild(button);
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
        // 系统回复test和分子按钮
        insertBotMessageWithButton('test', '分子');
      } else {
        // 系统自动回复 - 最新回复显示重新生成按钮
        insertBotMessage('test context', true);
      }
      input.value = '';
      updateBtnState();
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
      insertBotMessage('Welcome to the Molecular Universe. How can I help you today?', false);
    });
  }

  // 搜索聊天弹窗功能
  const searchChatModal = document.getElementById('searchChatModal');
  const searchChatBtn = document.getElementById('searchChatBtn');
  const searchChatClose = document.getElementById('searchChatClose');
  const searchChatInput = document.getElementById('searchChatInput');

  // 显示搜索聊天弹窗
  function showSearchChatModal() {
    searchChatModal.classList.add('show');
    searchChatInput.focus();
  }

  // 隐藏搜索聊天弹窗
  function hideSearchChatModal() {
    searchChatModal.classList.remove('show');
    searchChatInput.value = '';
  }

  // 搜索聊天按钮点击事件
  if (searchChatBtn) {
    searchChatBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showSearchChatModal();
    });
  }

  // 关闭按钮点击事件
  if (searchChatClose) {
    searchChatClose.addEventListener('click', hideSearchChatModal);
  }

  // 点击背景关闭弹窗
  if (searchChatModal) {
    searchChatModal.addEventListener('click', function(e) {
      if (e.target === searchChatModal) {
        hideSearchChatModal();
      }
    });
  }

  // ESC键关闭弹窗
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (searchChatModal.classList.contains('show')) {
        hideSearchChatModal();
      }
      // 关闭分子浮层
      if (document.querySelector('.molecule-panel') && document.querySelector('.molecule-panel').style.display === 'block') {
        closeMoleculePanel();
      }
    }
  });

  // 搜索功能
  if (searchChatInput) {
    searchChatInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const chatItems = document.querySelectorAll('.search-chat-item:not(.new-chat-item)');
      
      chatItems.forEach(item => {
        const text = item.querySelector('span').textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 搜索聊天项目点击事件
  const searchChatItems = document.querySelectorAll('.search-chat-item');
  searchChatItems.forEach(item => {
    item.addEventListener('click', function() {
      const chatTitle = this.querySelector('span').textContent;
      const chatId = this.getAttribute('data-chat-id');
      
      if (chatTitle === '新聊天') {
        // 创建新聊天
        chatMessages.innerHTML = '';
        insertBotMessage('Welcome to the Molecular Universe. How can I help you today?');
      } else if (chatId && chatHistory[chatId]) {
        // 加载现有聊天
        loadChatHistory(chatId);
      } else {
        // 模拟加载聊天
        console.log('Loading chat:', chatTitle);
        chatMessages.innerHTML = '';
        insertBotMessage(`Loading chat: ${chatTitle}`);
      }
      
      hideSearchChatModal();
    });
  });

  // 显示分子详情浮层 - 使用模块化版本
  function showMoleculePanel(moleculeName) {
    // 触发分子点击事件，让模块化的分子面板处理
    window.dispatchEvent(new CustomEvent('moleculeClicked', { 
      detail: { moleculeName } 
    }));
  }

  // 关闭分子详情浮层 - 使用模块化版本
  window.closeMoleculePanel = function() {
    if (window.moleculePanel) {
      window.moleculePanel.hide();
    }
  };

  // 模拟对话数据
  const chatHistory = {
    1: {
      title: "电解质溶剂稳定性预测分析",
      messages: [
        { type: 'user', content: '如何预测电解质溶剂的稳定性？' },
        { type: 'bot', content: '电解质溶剂稳定性可以通过分子动力学模拟和量子化学计算来预测。主要考虑因素包括：\n\n1. 溶剂分子的分解电位\n2. 与电极材料的相容性\n3. 温度稳定性\n4. 氧化还原稳定性\n\n建议使用DFT计算溶剂分子的HOMO-LUMO能隙来评估其电化学稳定性。' }
      ]
    },
    2: {
      title: "锂枝晶形成原因及抑制方法",
      messages: [
        { type: 'user', content: '锂枝晶形成的主要原因是什么？' },
        { type: 'bot', content: '锂枝晶形成的主要原因包括：\n\n1. 不均匀的锂离子沉积\n2. 电解质浓度梯度\n3. 界面阻抗不均匀\n4. 温度分布不均\n\n抑制方法：\n- 使用固态电解质\n- 优化电解质配方\n- 添加成核剂\n- 控制充放电倍率' }
      ]
    },
    3: {
      title: "SEI层组成成分研究",
      messages: [
        { type: 'user', content: 'SEI层主要由哪些成分组成？' },
        { type: 'bot', content: 'SEI（固体电解质界面）层主要由以下成分组成：\n\n1. 无机成分：\n   - LiF, Li2CO3, Li2O\n   - 碳酸锂盐类\n\n2. 有机成分：\n   - 聚碳酸酯\n   - 烷基碳酸锂\n   - 醚类化合物\n\nSEI层的组成直接影响电池的循环性能和安全性。' }
      ]
    },
    4: {
      title: "高镍正极材料性能优化",
      messages: [
        { type: 'user', content: '如何优化高镍正极材料的性能？' },
        { type: 'bot', content: '高镍正极材料性能优化策略：\n\n1. 表面包覆：\n   - Al2O3, ZrO2等氧化物包覆\n   - 导电聚合物包覆\n\n2. 元素掺杂：\n   - Co, Mn, Al等元素掺杂\n   - 改善结构稳定性\n\n3. 形貌控制：\n   - 控制颗粒大小和形貌\n   - 提高振实密度' }
      ]
    },
    5: {
      title: "固态电解质界面稳定性",
      messages: [
        { type: 'user', content: '固态电解质界面稳定性如何评估？' },
        { type: 'bot', content: '固态电解质界面稳定性评估方法：\n\n1. 电化学测试：\n   - 循环伏安法\n   - 电化学阻抗谱\n\n2. 物理表征：\n   - SEM观察界面形貌\n   - XRD分析相结构\n   - XPS分析化学组成\n\n3. 理论计算：\n   - 界面能计算\n   - 扩散系数预测' }
      ]
    },
    6: {
      title: "电池热管理系统设计",
      messages: [
        { type: 'user', content: '电池热管理系统的设计要点有哪些？' },
        { type: 'bot', content: '电池热管理系统设计要点：\n\n1. 温度控制：\n   - 工作温度范围：15-35°C\n   - 温度均匀性控制\n\n2. 散热设计：\n   - 风冷/液冷系统\n   - 热管技术应用\n\n3. 安全保护：\n   - 过温保护\n   - 热失控预防\n\n4. 能效优化：\n   - 降低系统功耗\n   - 提高散热效率' }
      ]
    },
    7: {
      title: "LiFePO4石墨电池电解质推荐",
      messages: [
        { type: 'user', content: '为LiFePO4和石墨电池推荐一种电解质' },
        { type: 'bot', content: '对于 LiFePO4 和石墨电池，推荐使用六氟磷酸锂 - 碳酸酯电解液，其主要由六氟磷酸锂（LiPF6）、碳酸酯类有机溶剂和添加剂组成。具体介绍如下：\n\n锂盐：LiPF6 是最常用的电解质锂盐，它具有溶解性好、离子传导能力高、离子解离度高等优点，能为电池提供大量可在正负极之间穿梭的锂离子，保证电池的充放电性能。但其热稳定性差，易水解生成 HF，会导致电池性能衰减，因此在使用和储存过程中需注意保持干燥。\n\n有机溶剂：常用的有碳酸乙烯酯（EC）、碳酸二乙酯（DEC）、碳酸二甲酯（DMC）、碳酸甲乙酯（EMC）等。通常会使用多种碳酸酯混合作为溶剂，如 EC 与一种链状碳酸酯的混合溶剂，如 EC+DMC、EC+DEC 等，可在石墨负极表面形成稳定的固体电解质界面（SEI）膜，有助于提高电池的循环性能。\n\n添加剂：添加剂种类繁多，作用各异。例如，碳酸亚乙烯酯（VC）可在放电过程中生成大分子网络状聚合物参与 SEI 层的形成，降低锂离子电池首次容量损失，改善高温下 SEI 层的稳定性，提高循环寿命；氟代碳酸亚乙酯（FEC）能改善电池低温性能，增强电极材料的稳定性，是实现高安全、高倍率和长循环寿命的重要添加剂。\n\n此外，也可考虑将双亚胺锂（LiFSI）与 LiPF6 混合使用的电解液。LiFSI 具有比 LiPF6 更好的热稳定性、导离子能力及更高的锂离子迁移数，将其作为辅助锂盐与 LiPF6 混合，能充分发挥二者优势，提高电解液的电导率和锂离子迁移数，有助于降低电极表面膜阻抗，形成稳定的、导离子性较好的钝化膜，更适用于高功率锂离子电池。' }
      ]
    }
  };

  // 加载历史对话
  function loadChatHistory(chatId) {
    const chatData = chatHistory[chatId];
    if (!chatData) return;
    
    // 清空当前对话
    chatMessages.innerHTML = '';
    
    // 首先插入欢迎语
    insertBotMessage('Welcome to the Molecular Universe. How can I help you today?', false);
    
    // 加载历史消息
    chatData.messages.forEach((msg, index) => {
      if (msg.type === 'user') {
        insertUserMessage(msg.content);
      } else {
        // 只有最后一条机器人消息显示重新生成按钮
        const isLastBotMessage = index === chatData.messages.length - 1;
        insertBotMessage(msg.content, isLastBotMessage);
      }
    });
    
    // 更新页面标题（可选）
    document.title = `Ask - ${chatData.title}`;
  }

  // 为历史对话添加点击事件
  const recentChats = document.querySelectorAll('.recent-chat');
  recentChats.forEach(chat => {
    chat.addEventListener('click', function(e) {
      e.preventDefault();
      const chatId = this.getAttribute('data-chat-id');
      console.log('Clicked chat ID:', chatId); // 调试日志
      loadChatHistory(chatId);
    });
  });

  // 为菜单按钮添加点击事件
  const menuButtons = document.querySelectorAll('.chat-menu-btn');
  menuButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const chatId = this.getAttribute('data-chat-id');
      
      // 检查对话是否已置顶
      const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('li');
      const isPinned = chatElement && chatElement.classList.contains('pinned');
      
      // 创建删除确认菜单
      const menu = document.createElement('div');
      menu.className = 'chat-delete-menu';
      menu.innerHTML = `
        <div class="delete-menu-content">
          <button class="rename-chat-btn" data-chat-id="${chatId}">修改名称</button>
          <button class="pin-chat-btn" data-chat-id="${chatId}">${isPinned ? '取消置顶' : '置顶对话'}</button>
          <button class="delete-chat-btn" data-chat-id="${chatId}">删除对话</button>
        </div>
      `;
      
      // 定位菜单
      const rect = this.getBoundingClientRect();
      menu.style.position = 'absolute';
      menu.style.top = rect.bottom + 'px';
      menu.style.left = rect.left + 'px';
      menu.style.zIndex = '1000';
      
      // 添加到页面
      document.body.appendChild(menu);
      
      // 点击其他地方关闭菜单
      const closeMenu = (e) => {
        if (!menu.contains(e.target) && !this.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      };
      
      setTimeout(() => {
        document.addEventListener('click', closeMenu);
      }, 0);
      
      // 修改名称按钮点击事件
      const renameBtn = menu.querySelector('.rename-chat-btn');
      renameBtn.addEventListener('click', function() {
        const chatIdToRename = this.getAttribute('data-chat-id');
        renameChat(chatIdToRename);
        menu.remove();
        document.removeEventListener('click', closeMenu);
      });

      // 置顶/取消置顶按钮点击事件
      const pinBtn = menu.querySelector('.pin-chat-btn');
      pinBtn.addEventListener('click', function() {
        const chatIdToPin = this.getAttribute('data-chat-id');
        if (isPinned) {
          unpinChat(chatIdToPin);
        } else {
          pinChat(chatIdToPin);
        }
        menu.remove();
        document.removeEventListener('click', closeMenu);
      });

      // 删除按钮点击事件
      const deleteBtn = menu.querySelector('.delete-chat-btn');
      deleteBtn.addEventListener('click', function() {
        const chatIdToDelete = this.getAttribute('data-chat-id');
        deleteChat(chatIdToDelete);
        menu.remove();
        document.removeEventListener('click', closeMenu);
      });
    });
  });

  // 置顶对话函数
  function pinChat(chatId) {
    const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('li');
    if (chatElement) {
      // 添加置顶标识
      chatElement.classList.add('pinned');
      
      // 移动到顶部
      const historyNav = document.querySelector('.history-nav ul');
      historyNav.insertBefore(chatElement, historyNav.firstChild);
      
      console.log('Pinned chat:', chatId);
    }
  }

  // 取消置顶对话函数
  function unpinChat(chatId) {
    const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('li');
    if (chatElement) {
      // 移除置顶标识
      chatElement.classList.remove('pinned');
      
      // 移动到非置顶区域（在第一个非置顶对话之前）
      const historyNav = document.querySelector('.history-nav ul');
      const pinnedChats = historyNav.querySelectorAll('li.pinned');
      const firstNonPinned = historyNav.querySelector('li:not(.pinned)');
      
      if (firstNonPinned) {
        historyNav.insertBefore(chatElement, firstNonPinned);
      } else {
        // 如果没有非置顶对话，添加到末尾
        historyNav.appendChild(chatElement);
      }
      
      console.log('Unpinned chat:', chatId);
    }
  }

  // 删除对话函数
  function deleteChat(chatId) {
    // 从chatHistory中删除
    if (chatHistory[chatId]) {
      delete chatHistory[chatId];
    }
    
    // 从DOM中删除对应的li元素
    const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('li');
    if (chatElement) {
      chatElement.remove();
    }
    
    console.log('Deleted chat:', chatId);
  }

  // 修改对话名称函数
  function renameChat(chatId) {
    const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`);
    if (!chatElement) return;
    
    const currentName = chatElement.textContent;
    
    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'chat-rename-input';
    input.style.cssText = `
      width: 100%;
      padding: 4px 8px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      background: white;
      color: #374151;
    `;
    
    // 替换原来的文本
    chatElement.textContent = '';
    chatElement.appendChild(input);
    input.focus();
    input.select();
    
    // 处理回车键确认
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const newName = input.value.trim();
        if (newName) {
          chatElement.textContent = newName;
          console.log('Renamed chat:', chatId, 'to:', newName);
        } else {
          chatElement.textContent = currentName; // 如果输入为空，恢复原名
        }
      } else if (e.key === 'Escape') {
        chatElement.textContent = currentName; // 取消修改，恢复原名
      }
    });
    
    // 处理失焦事件
    input.addEventListener('blur', function() {
      const newName = input.value.trim();
      if (newName) {
        chatElement.textContent = newName;
        console.log('Renamed chat:', chatId, 'to:', newName);
      } else {
        chatElement.textContent = currentName; // 如果输入为空，恢复原名
      }
    });
  }

  // 页面加载时插入欢迎语
  insertBotMessage('Welcome to the Molecular Universe. How can I help you today?');

  // ESC键关闭分子面板
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const moleculePanel = document.getElementById('moleculePanel');
      if (moleculePanel && moleculePanel.style.display === 'block') {
        closeMoleculePanel();
      }
    }
  });

  if (toggleSidebarBtn && sidebar && chatContainer) {
    toggleSidebarBtn.addEventListener('click', function() {
      // 切换mini-sidebar状态
      sidebar.classList.toggle('mini-sidebar');
    });
  }

  // 为mini切换按钮添加事件监听
  const miniToggleSidebarBtn = document.getElementById('miniToggleSidebarBtn');
  if (miniToggleSidebarBtn && sidebar && chatContainer) {
    miniToggleSidebarBtn.addEventListener('click', function() {
      // 切换mini-sidebar状态
      sidebar.classList.toggle('mini-sidebar');
    });
  }

  // 为mini新聊天按钮添加事件监听
  const miniNewChatBtn = document.getElementById('miniNewChatBtn');
  if (miniNewChatBtn) {
    miniNewChatBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // 触发新聊天功能
      if (newChatBtn) {
        newChatBtn.click();
      }
    });
  }

  // 为mini搜索按钮添加事件监听
  const miniSearchBtn = document.getElementById('miniSearchBtn');
  if (miniSearchBtn) {
    miniSearchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // 触发搜索功能
      showSearchChatModal();
    });
  }
}); 