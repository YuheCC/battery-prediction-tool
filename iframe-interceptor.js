// iframe 样例数据拦截器 - 最终强力版本
(function() {
  'use strict';
  
  console.log('🚀 最终强力样例数据拦截器正在启动...');
  
  // 等待 iframe 加载完成
  function waitForIframe() {
    const iframe = document.querySelector('#predictionIframe');
    if (!iframe) {
      setTimeout(waitForIframe, 100);
      return;
    }
    
    iframe.addEventListener('load', function() {
      console.log('✅ iframe 已加载，开始最终强力拦截样例数据...');
      setTimeout(interceptSampleData, 300);
    });
  }
  
  // 检查元素是否包含样例数据相关文本
  function containsSampleDataText(element) {
    if (!element) return false;
    
    const text = (element.textContent || element.innerText || '').toLowerCase();
    const keywords = [
      '样例数据', '下载样例数据', 'sample', 'sample data', 
      '请按', '请按样例数据', '样例', '数据样例', 'sample data'
    ];
    
    return keywords.some(keyword => text.includes(keyword));
  }
  
  // 最终强力隐藏元素
  function ultimateHideElement(element) {
    if (!element) return;
    
    try {
      // 设置多种隐藏样式
      element.style.cssText = `
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        color: transparent !important;
        font-size: 0 !important;
        line-height: 0 !important;
        max-width: 0 !important;
        max-height: 0 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        transform: scale(0) !important;
        z-index: -9999 !important;
      `;
      
      // 添加标记属性
      element.setAttribute('data-sample-data-hidden', 'true');
      element.setAttribute('data-original-display', element.style.display);
      element.setAttribute('data-hidden-time', Date.now());
      
      // 移除所有子元素
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      
      // 清空文本内容
      element.textContent = '';
      element.innerText = '';
      element.innerHTML = '';
      
      // 移除所有事件监听器
      const newElement = element.cloneNode(false);
      if (element.parentNode) {
        element.parentNode.replaceChild(newElement, element);
      }
      
    } catch (error) {
      console.log('隐藏元素时出错:', error);
    }
  }
  
  // 拦截样例数据功能
  function interceptSampleData() {
    const iframe = document.querySelector('#predictionIframe');
    if (!iframe || !iframe.contentWindow || !iframe.contentWindow.document) {
      setTimeout(interceptSampleData, 300);
      return;
    }
    
    try {
      const doc = iframe.contentWindow.document;
      const win = iframe.contentWindow;
      
      console.log('🔥 开始最终强力拦截样例数据功能...');
      
      // 方法1: 注入最终强力CSS
      const style = doc.createElement('style');
      style.textContent = `
        /* 最终强力隐藏样例数据相关元素 */
        *[data-sample-data-hidden="true"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          background: transparent !important;
          color: transparent !important;
          font-size: 0 !important;
          line-height: 0 !important;
          max-width: 0 !important;
          max-height: 0 !important;
          min-width: 0 !important;
          min-height: 0 !important;
          transform: scale(0) !important;
          z-index: -9999 !important;
        }
        
        /* 隐藏包含特定文本的元素 */
        *:contains("样例数据"),
        *:contains("请按"),
        *:contains("sample"),
        *:contains("Sample") {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      doc.head.appendChild(style);
      
      // 方法2: 拦截所有相关函数
      const originalFunctions = {
        createElement: win.document.createElement,
        setAttribute: win.Element.prototype.setAttribute,
        addEventListener: win.Element.prototype.addEventListener
      };
      
      // 拦截创建元素
      win.document.createElement = function(tagName) {
        const element = originalFunctions.createElement.call(this, tagName);
        if (tagName.toLowerCase() === 'a') {
          const originalSetAttribute = element.setAttribute;
          element.setAttribute = function(name, value) {
            if (name === 'href' && value && (
              value.includes('sample_battery_data.csv') ||
              value.includes('sample') ||
              value.includes('Sample')
            )) {
              console.log('🚫 样例数据下载已被拦截');
              return;
            }
            return originalSetAttribute.call(this, name, value);
          };
        }
        return element;
      };
      
      // 方法3: 最终强力事件拦截
      doc.addEventListener('click', function(e) {
        const text = (e.target.textContent || e.target.innerText || '').toLowerCase();
        if (text.includes('样例数据') || text.includes('下载样例数据') || text.includes('sample') || text.includes('请按')) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.log('🚫 样例数据操作已被最终强力拦截:', text);
          
          // 立即隐藏被点击的元素
          ultimateHideElement(e.target);
          return false;
        }
      }, true);
      
      // 方法4: 最终强力元素查找和隐藏
      const ultimateHideSampleDataElements = function() {
        let hiddenCount = 0;
        
        // 查找所有元素
        const allElements = doc.querySelectorAll('*');
        
        allElements.forEach(function(el) {
          if (el.getAttribute('data-sample-data-hidden') === 'true') {
            return; // 已经隐藏过了
          }
          
          if (containsSampleDataText(el)) {
            ultimateHideElement(el);
            hiddenCount++;
            console.log('🔥 最终强力隐藏样例数据元素:', el.textContent);
          }
        });
        
        // 特别查找文本节点
        const walker = doc.createTreeWalker(
          doc.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent.toLowerCase();
          if (text.includes('请按') || text.includes('样例数据') || text.includes('sample')) {
            const parent = node.parentElement;
            if (parent && parent.getAttribute('data-sample-data-hidden') !== 'true') {
              ultimateHideElement(parent);
              hiddenCount++;
              console.log('🔥 最终强力隐藏包含样例数据文本的元素:', parent.textContent);
            }
          }
        }
        
        return hiddenCount;
      };
      
      // 立即执行多次
      let totalHidden = 0;
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const count = ultimateHideSampleDataElements();
          totalHidden += count;
          console.log(`🔄 第${i+1}次检查隐藏了 ${count} 个样例数据元素，总计: ${totalHidden}`);
        }, i * 100);
      }
      
      // 超高频定期执行
      setInterval(function() {
        const count = ultimateHideSampleDataElements();
        if (count > 0) {
          console.log(`⏰ 定期检查最终强力隐藏了 ${count} 个样例数据元素`);
        }
      }, 200);
      
      // 监听 DOM 变化
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (containsSampleDataText(node)) {
                  ultimateHideElement(node);
                  console.log('👁️ DOM变化检测到样例数据元素，已最终强力隐藏:', node.textContent);
                }
              }
            });
          }
        });
      });
      
      observer.observe(doc.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      
      // 方法5: 拦截全局函数
      if (win.downloadSampleData) {
        win.downloadSampleData = function() {
          console.log('🚫 样例数据下载函数已被拦截');
          return false;
        };
      }
      
      // 方法6: 覆盖全局变量
      win.sampleDataSets = null;
      win.sampleData = null;
      
      console.log('🎉 最终强力样例数据拦截器已启动，包含DOM变化监听、函数拦截和变量覆盖');
      
    } catch (error) {
      console.log('❌ 最终强力拦截样例数据时出错:', error);
    }
  }
  
  // 启动拦截器
  waitForIframe();
})();
