const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3005;

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
app.use(bodyParser.json());

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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 