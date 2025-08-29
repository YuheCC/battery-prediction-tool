const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3111;

// 项目信息
const PROJECT_NAME = 'Prediction1';
const PROJECT_VERSION = '1.0.0';

// CORS 跨域中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 增加请求体大小限制，支持大文件上传
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 用户数据文件路径
const USERS_FILE = path.join(__dirname, 'users.json');

// 工具函数：读取和写入用户数据
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 生成简单的验证码
function generateVerificationCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 登录接口
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: '账号不存在' });
    }
    if (user.password !== password) {
        return res.status(400).json({ message: '账号或密码错误' });
    }
    if (!user.email_verified) {
        return res.status(400).json({ message: '邮箱未验证，请查看您的邮件进行验证' });
    }
    // 登录成功
    return res.json({ message: '登录成功', user: { email: user.email, firstName: user.firstName, lastName: user.lastName } });
});

// 注册接口
app.post('/api/register', (req, res) => {
    const { lastName, firstName, email, password } = req.body;
    if (!lastName || !firstName || !email || !password) {
        return res.status(400).json({ message: '信息不完整' });
    }
    const users = readUsers();
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: '该邮箱已注册' });
    }
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        lastName,
        firstName,
        email,
        password,
        email_verified: false // 默认未激活
    };
    users.push(newUser);
    writeUsers(users);
    // 模拟发送激活邮件
    return res.json({ message: '注册成功，请前往邮箱验证后登录' });
});

// 忘记密码接口
app.post('/api/forgot', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: '请输入邮箱地址' });
    }
    
    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: '该邮箱未注册' });
    }
    
    // 生成重置密码的验证码
    const resetCode = generateVerificationCode();
    user.resetCode = resetCode;
    user.resetCodeExpiry = Date.now() + 30 * 60 * 1000; // 30分钟有效期
    writeUsers(users);
    
    // 模拟发送重置密码邮件
    console.log(`重置密码验证码已发送到 ${email}: ${resetCode}`);
    
    return res.json({ message: '重置密码验证码已发送到您的邮箱' });
});

// 重置密码接口
app.post('/api/reset-password', (req, res) => {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
        return res.status(400).json({ message: '信息不完整' });
    }
    
    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: '用户不存在' });
    }
    
    if (!user.resetCode || user.resetCode !== code) {
        return res.status(400).json({ message: '验证码错误' });
    }
    
    if (user.resetCodeExpiry && Date.now() > user.resetCodeExpiry) {
        return res.status(400).json({ message: '验证码已过期' });
    }
    
    // 更新密码
    user.password = newPassword;
    delete user.resetCode;
    delete user.resetCodeExpiry;
    writeUsers(users);
    
    return res.json({ message: '密码重置成功' });
});

// 邮箱验证接口
app.post('/api/verify', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ message: '信息不完整' });
    }
    
    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: '用户不存在' });
    }
    
    // 模拟验证码验证（这里简化处理，实际应该从邮件中获取验证码）
    if (code === '123456') { // 模拟验证码
        user.email_verified = true;
        writeUsers(users);
        return res.json({ message: '邮箱验证成功' });
    } else {
        return res.status(400).json({ message: '验证码错误' });
    }
});

// 获取用户信息接口
app.get('/api/user/:email', (req, res) => {
    const { email } = req.params;
    const users = readUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return res.status(404).json({ message: '用户不存在' });
    }
    
    // 不返回密码等敏感信息
    const { password, resetCode, resetCodeExpiry, ...userInfo } = user;
    return res.json(userInfo);
});

// 更新用户信息接口
app.put('/api/user/:email', (req, res) => {
    const { email } = req.params;
    const { firstName, lastName } = req.body;
    
    const users = readUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: '用户不存在' });
    }
    
    if (firstName) users[userIndex].firstName = firstName;
    if (lastName) users[userIndex].lastName = lastName;
    
    writeUsers(users);
    return res.json({ message: '用户信息更新成功' });
});

// 早期生命预测接口
app.post('/api/early-life-prediction', (req, res) => {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: '请提供有效的预测数据' });
    }
    
    console.log(`收到预测请求，数据量: ${data.length} 条记录`);
    
    try {
        // 对于大数据集，采用分批处理
        const batchSize = 1000; // 每批处理1000条记录
        const totalBatches = Math.ceil(data.length / batchSize);
        
        console.log(`将分 ${totalBatches} 批处理数据`);
        
        // 模拟预测处理时间
        setTimeout(() => {
            let allResults = [];
            
            // 分批处理数据
            for (let i = 0; i < totalBatches; i++) {
                const startIndex = i * batchSize;
                const endIndex = Math.min(startIndex + batchSize, data.length);
                const batchData = data.slice(startIndex, endIndex);
                
                console.log(`处理第 ${i + 1}/${totalBatches} 批，记录 ${startIndex + 1}-${endIndex}`);
                const batchResults = performEarlyLifePrediction(batchData);
                allResults = allResults.concat(batchResults);
            }
            
            const summary = {
                totalSamples: data.length,
                averageCycleLife: Math.round(allResults.reduce((sum, r) => sum + r.cycleLife, 0) / allResults.length),
                predictionTime: new Date().toISOString(),
                processedBatches: totalBatches
            };
            
            console.log(`预测完成，共处理 ${allResults.length} 条记录`);
            
            res.json({
                success: true,
                message: '预测完成',
                results: allResults,
                summary: summary
            });
        }, 2000); // 模拟2秒处理时间
        
    } catch (error) {
        console.error('预测处理错误:', error);
        res.status(500).json({ message: '预测处理失败', error: error.message });
    }
});

// 执行早期生命预测算法
function performEarlyLifePrediction(data) {
    const results = [];
    
    data.forEach((row, index) => {
        const barcode = row.barcode || row.Barcode || `BAT${String(index + 1).padStart(3, '0')}`;
        
        // 基于多个特征进行预测
        let cycleLife = 300; // 基础预测值
        let confidence = 0.7; // 置信度
        let explanation = '基于早期循环数据预测';
        
        // 电流特征分析
        if (row.current) {
            const current = parseFloat(row.current);
            if (current > 2.5) {
                cycleLife -= 50;
                explanation = '高电流充放电，加速电池衰减';
            } else if (current > 2.0) {
                cycleLife -= 20;
                explanation = '中等电流充放电，性能稳定';
            } else if (current > 1.5) {
                cycleLife += 30;
                explanation = '低电流充放电，有利于延长寿命';
            }
        }
        
        // 电压特征分析
        if (row.voltage || row.Voltage) {
            const voltage = parseFloat(row.voltage || row.Voltage);
            if (voltage > 3.5) {
                cycleLife += 30;
                confidence += 0.1;
                explanation = '电压稳定，电池性能良好';
            } else if (voltage < 3.0) {
                cycleLife -= 30;
                confidence -= 0.1;
                explanation = '电压偏低，需要关注电池状态';
            }
        }
        
        // 循环ID分析
        if (row.cycle_id) {
            const cycleId = parseInt(row.cycle_id);
            if (cycleId > 100) {
                cycleLife -= cycleId * 0.3;
                explanation += '，已使用较多循环';
            } else if (cycleId > 50) {
                cycleLife -= cycleId * 0.2;
                explanation += '，循环次数适中';
            }
        }
        
        // 时间特征分析
        if (row.time) {
            const time = parseFloat(row.time);
            if (time > 200) {
                cycleLife -= 40;
                explanation += '，充放电时间较长';
            } else if (time < 50) {
                cycleLife += 20;
                explanation += '，充放电效率较高';
            }
        }
        
        // 确保预测值在合理范围内
        cycleLife = Math.max(100, Math.min(800, Math.round(cycleLife)));
        confidence = Math.max(0.3, Math.min(0.95, confidence));
        
        results.push({
            barcode: barcode,
            cycleLife: cycleLife,
            confidence: confidence,
            explanation: explanation,
            features: {
                current: row.current || 'N/A',
                voltage: row.voltage || row.Voltage || 'N/A',
                cycle_id: row.cycle_id || 'N/A',
                time: row.time || 'N/A'
            }
        });
    });
    
    return results;
}

app.listen(PORT, () => {
  console.log(`🚀 ${PROJECT_NAME} v${PROJECT_VERSION}`);
  console.log(`Server running at http://localhost:${PORT}`);
}); 