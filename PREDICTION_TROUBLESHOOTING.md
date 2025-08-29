# 预测功能问题排查指南

## 🔧 问题描述
用户反馈：点击开始预测分析后，结果失败。

## 🛠️ 排查步骤

### 1. 使用调试页面
访问 `http://localhost:3010/debug-prediction.html` 进行系统化排查：

1. **服务器状态检查** - 确认服务器是否正常运行
2. **API测试** - 验证预测API是否工作正常
3. **文件上传测试** - 检查文件解析功能
4. **完整流程测试** - 测试端到端流程

### 2. 浏览器控制台检查
在早期生命预测页面打开开发者工具 (F12)，查看控制台输出：

#### 正常情况下的日志：
```
setupFileUpload called
uploadArea: <div class="upload-area" id="uploadArea">
fileInput: <input type="file" id="fileInput" accept=".csv,.xlsx,.xls" style="display: none;">
setupFileUpload completed successfully

Upload area clicked!
File selected: sample_battery_data.csv
File size: 1234 bytes
File type: text/csv
File extension: .csv
handleFileSelect called with: sample_battery_data.csv
File uploaded successfully: 15 records

开始调用预测API...
发送的数据: [Array(15)]
API响应状态: 200 OK
API返回数据: {success: true, message: "预测完成", ...}
预测成功，开始处理结果...
结果处理完成
预测流程结束，恢复按钮状态
```

#### 常见错误及解决方案：

### 3. 常见问题排查

#### 问题1: 网络连接失败
**症状**: 控制台显示 `TypeError: fetch failed`
**解决方案**:
- 检查服务器是否运行: `npm start`
- 确认端口3010没有被占用
- 检查防火墙设置

#### 问题2: API返回错误
**症状**: 控制台显示 `HTTP 500` 或其他错误状态码
**解决方案**:
- 检查服务器日志
- 验证API路由是否正确配置
- 确认请求数据格式

#### 问题3: 文件解析失败
**症状**: 文件上传后显示"文件解析失败"
**解决方案**:
- 检查CSV文件格式是否正确
- 确认文件编码为UTF-8
- 验证必需字段是否存在

#### 问题4: 数据格式错误
**症状**: API返回"请提供有效的预测数据"
**解决方案**:
- 检查数据字段名称是否正确
- 确认数值字段为数字格式
- 验证数据不为空

### 4. 测试方法



#### 方法2: 使用示例文件
使用提供的 `sample_battery_data.csv` 文件进行测试。

#### 方法3: 手动测试API
```bash
curl -X POST http://localhost:3010/api/early-life-prediction \
  -H "Content-Type: application/json" \
  -d '{"data":[{"Barcode":"BAT001","Cycle":5,"Capacity":0.985,"Voltage":3.65,"Temperature":25.2}]}'
```

### 5. 数据格式要求

#### CSV文件格式：
```csv
Barcode,Cycle,Capacity,Voltage,Temperature
BAT001,5,0.985,3.65,25.2
BAT002,8,0.972,3.62,26.1
```

#### 必需字段：
- `Barcode`: 电池条码 (字符串)
- `Cycle`: 循环次数 (数字)
- `Capacity`: 容量保持率 (0-1之间的数字)
- `Voltage`: 电压 (数字)
- `Temperature`: 温度 (数字)

### 6. 错误代码说明

| 错误代码 | 含义 | 解决方案 |
|---------|------|----------|
| HTTP 400 | 请求数据格式错误 | 检查JSON格式和数据字段 |
| HTTP 404 | API路由不存在 | 确认服务器配置正确 |
| HTTP 500 | 服务器内部错误 | 查看服务器日志 |
| TypeError | JavaScript错误 | 检查浏览器控制台 |

### 7. 调试工具

#### 浏览器控制台命令：
```javascript
// 检查全局变量
console.log(window.selectedFile);
console.log(window.fileData);

// 测试预测功能
testPrediction();

// 运行调试检查
runAllChecks();

// 手动调用API
fetch('/api/early-life-prediction', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        data: [{
            Barcode: 'BAT001',
            Cycle: 5,
            Capacity: 0.985,
            Voltage: 3.65,
            Temperature: 25.2
        }]
    })
}).then(r => r.json()).then(console.log);
```

### 8. 预防措施

1. **数据验证**: 上传前检查文件格式和内容
2. **错误处理**: 完善的错误提示和恢复机制
3. **日志记录**: 详细的操作日志便于排查问题
4. **测试覆盖**: 定期运行自动化测试

### 9. 联系支持

如果问题仍然存在，请提供以下信息：
1. 浏览器控制台错误信息
2. 服务器日志
3. 使用的文件格式和内容
4. 操作步骤的详细描述

---

*更新时间: 2024年8月5日*
*版本: 1.0.0* 