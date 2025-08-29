// 调试文件上传问题的脚本
console.log('=== 文件上传调试脚本 ===');

// 检查页面元素
function checkElements() {
    console.log('\n1. 检查页面元素:');
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    console.log('uploadArea:', uploadArea);
    console.log('fileInput:', fileInput);
    
    if (uploadArea) {
        console.log('uploadArea.innerHTML:', uploadArea.innerHTML.substring(0, 100) + '...');
        console.log('uploadArea.style.pointerEvents:', uploadArea.style.pointerEvents);
        console.log('uploadArea.style.zIndex:', uploadArea.style.zIndex);
    }
    
    if (fileInput) {
        console.log('fileInput.accept:', fileInput.accept);
        console.log('fileInput.style.display:', fileInput.style.display);
    }
}

// 检查事件监听器
function checkEventListeners() {
    console.log('\n2. 检查事件监听器:');
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadArea) {
        // 尝试获取事件监听器信息（注意：这在实际浏览器中可能不可用）
        console.log('uploadArea 事件监听器检查完成');
    }
    
    if (fileInput) {
        console.log('fileInput 事件监听器检查完成');
    }
}

// 模拟点击测试
function testClick() {
    console.log('\n3. 模拟点击测试:');
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadArea && fileInput) {
        console.log('尝试模拟点击上传区域...');
        
        // 创建点击事件
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        // 触发点击事件
        uploadArea.dispatchEvent(clickEvent);
        
        console.log('点击事件已触发');
    } else {
        console.log('❌ 找不到必要的元素');
    }
}

// 检查全局变量
function checkGlobalVariables() {
    console.log('\n4. 检查全局变量:');
    
    console.log('window.selectedFile:', window.selectedFile);
    console.log('window.fileData:', window.fileData);
    console.log('earlyLifeHistory:', typeof earlyLifeHistory !== 'undefined' ? earlyLifeHistory.length : 'undefined');
}

// 检查函数定义
function checkFunctions() {
    console.log('\n5. 检查函数定义:');
    
    const functions = [
        'setupFileUpload',
        'handleUploadAreaClick',
        'handleFileInputChange',
        'handleFileSelect',
        'resetFileUpload'
    ];
    
    functions.forEach(funcName => {
        console.log(`${funcName}:`, typeof window[funcName] === 'function' ? '✅ 已定义' : '❌ 未定义');
    });
}

// 运行所有检查
function runAllChecks() {
    console.log('开始运行调试检查...\n');
    
    checkElements();
    checkEventListeners();
    checkGlobalVariables();
    checkFunctions();
    
    console.log('\n=== 调试检查完成 ===');
    console.log('\n提示: 在浏览器控制台中运行 testClick() 来测试点击功能');
}

// 页面加载完成后运行检查
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllChecks);
} else {
    runAllChecks();
}

// 导出测试函数到全局作用域
window.testClick = testClick;
window.runAllChecks = runAllChecks; 