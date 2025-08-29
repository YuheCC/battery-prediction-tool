// 测试预测流程的完整脚本
const fs = require('fs');

// 模拟CSV解析
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
    }
    
    return data;
}

// 测试预测流程
async function testPredictionFlow() {
    try {
        console.log('🚀 开始测试预测流程...\n');
        
        // 1. 读取CSV文件
        console.log('1. 读取CSV文件...');
        const csvData = fs.readFileSync('sample_battery_data.csv', 'utf-8');
        console.log('✅ CSV文件读取成功');
        
        // 2. 解析CSV数据
        console.log('\n2. 解析CSV数据...');
        const parsedData = parseCSV(csvData);
        console.log(`✅ 解析成功，共 ${parsedData.length} 条数据`);
        console.log('前3条数据预览:');
        console.log(parsedData.slice(0, 3));
        
        // 3. 验证数据格式
        console.log('\n3. 验证数据格式...');
        const requiredFields = ['Barcode', 'Cycle', 'Capacity', 'Voltage', 'Temperature'];
        const firstRow = parsedData[0];
        
        requiredFields.forEach(field => {
            if (firstRow[field] !== undefined) {
                console.log(`✅ ${field}: ${firstRow[field]}`);
            } else {
                console.log(`❌ ${field}: 缺失`);
            }
        });
        
        // 4. 调用预测API
        console.log('\n4. 调用预测API...');
        const response = await fetch('http://localhost:3010/api/early-life-prediction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: parsedData
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ API调用成功');
            console.log(`- 预测电芯数: ${result.summary.totalSamples}`);
            console.log(`- 平均循环寿命: ${result.summary.averageCycleLife} 次`);
            console.log(`- 预测时间: ${new Date(result.summary.predictionTime).toLocaleString('zh-CN')}`);
            
            console.log('\n预测结果示例:');
            result.results.slice(0, 3).forEach((item, index) => {
                console.log(`${index + 1}. ${item.barcode}: ${item.cycleLife} 次 (${Math.round(item.confidence * 100)}% 置信度)`);
            });
        } else {
            throw new Error(result.message || '预测失败');
        }
        
        console.log('\n🎉 预测流程测试完成！');
        
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        console.error('错误详情:', error);
    }
}

// 测试单个数据点
async function testSingleDataPoint() {
    try {
        console.log('\n🔍 测试单个数据点...');
        
        const testData = [{
            Barcode: 'BAT001',
            Cycle: '5',
            Capacity: '0.985',
            Voltage: '3.65',
            Temperature: '25.2'
        }];
        
        const response = await fetch('http://localhost:3010/api/early-life-prediction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: testData
            })
        });
        
        const result = await response.json();
        console.log('单个数据点测试结果:', result);
        
    } catch (error) {
        console.error('单个数据点测试失败:', error.message);
    }
}

// 检查服务器状态
async function checkServerStatus() {
    try {
        console.log('🔍 检查服务器状态...');
        
        const response = await fetch('http://localhost:3010/');
        if (response.ok) {
            console.log('✅ 服务器运行正常');
        } else {
            console.log('❌ 服务器响应异常');
        }
        
    } catch (error) {
        console.error('❌ 无法连接到服务器:', error.message);
    }
}

// 运行所有测试
async function runAllTests() {
    await checkServerStatus();
    await testSingleDataPoint();
    await testPredictionFlow();
}

// 运行测试
runAllTests(); 