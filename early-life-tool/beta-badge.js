// 隐藏iframe中的标题脚本
(function() {
    'use strict';
    
    function hideIframeTitle() {
        console.log('开始查找并隐藏iframe中的标题...');
        
        const targetText = '电池早期生命预测工具';
        const body = document.body;
        if (!body) {
            console.log('body元素不存在，等待...');
            return;
        }
        
        // 只精确隐藏包含目标文本的元素
        const allElements = body.querySelectorAll('*');
        let foundElements = [];
        
        allElements.forEach(element => {
            if (element.textContent && element.textContent.trim() === targetText) {
                foundElements.push(element);
                console.log('找到精确匹配标题的元素:', element.tagName, element.className);
                
                // 只隐藏这个元素，不影响其他内容
                element.style.display = 'none';
                element.classList.add('iframe-title-hidden');
            }
        });
        
        console.log('找到的元素总数:', foundElements.length);
        console.log('隐藏操作完成');
    }
    
    // 立即执行一次
    hideIframeTitle();
    
    // 页面加载完成后再次执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideIframeTitle);
    } else {
        hideIframeTitle();
    }
    
    // 监听DOM变化，处理动态加载的内容
    if (document.body) {
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    shouldUpdate = true;
                }
            });
            if (shouldUpdate) {
                setTimeout(hideIframeTitle, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 延迟执行，确保React应用完全加载
    setTimeout(hideIframeTitle, 500);
    setTimeout(hideIframeTitle, 2000);
})();
