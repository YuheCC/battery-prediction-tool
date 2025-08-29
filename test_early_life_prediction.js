const fs = require('fs');

// 读取CSV文件并转换为JSON格式
function csvToJson(csvText) {
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

// 测试早期生命预测API
async function testEarlyLifePrediction() {
    try {
        // 读取CSV文件
        const csvData = fs.readFileSync('sample_battery_data.csv', 'utf-8');
        const jsonData = csvToJson(csvData);
        
        console.log('📊 原始数据预览:');
        console.log(jsonData.slice(0, 3));
        console.log(`\n总共 ${jsonData.length} 个电芯\n`);
        
        // 调用API
        console.log('🚀 开始预测分析...');
        const response = await fetch('http://localhost:3010/api/early-life-prediction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: jsonData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ 预测完成！');
            console.log('\n📋 预测结果摘要:');
            console.log(`- 电芯数量: ${result.summary.totalSamples}`);
            console.log(`- 平均循环寿命: ${result.summary.averageCycleLife} 次`);
            console.log(`- 预测时间: ${new Date(result.summary.predictionTime).toLocaleString('zh-CN')}`);
            
            console.log('\n📊 详细预测结果:');
            result.results.forEach((item, index) => {
                const confidencePercent = Math.round(item.confidence * 100);
                const confidenceColor = confidencePercent >= 80 ? '🟢' : confidencePercent >= 60 ? '🟡' : '🔴';
                
                console.log(`${index + 1}. ${item.barcode}`);
                console.log(`   循环寿命: ${item.cycleLife} 次`);
                console.log(`   置信度: ${confidenceColor} ${confidencePercent}%`);
                console.log(`   特征: 容量=${item.features.capacity}, 电压=${item.features.voltage}, 温度=${item.features.temperature}, 循环=${item.features.cycle}`);
                console.log(`   说明: ${item.explanation}`);
                console.log('');
            });
            
            console.log('🎉 早期生命预测流程演示完成！');
        } else {
            console.error('❌ 预测失败:', result.message);
        }
        
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
    }
}

// 运行测试
testEarlyLifePrediction(); 