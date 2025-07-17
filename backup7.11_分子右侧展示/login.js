document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.textContent = '';

    if (!email || !password) {
        messageDiv.textContent = '请输入邮箱和密码';
        return;
    }

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            // 登录成功，跳转到产品主页
            window.location.href = '/map.html';
        } else {
            messageDiv.textContent = data.message || '登录失败';
        }
    } catch (err) {
        messageDiv.textContent = '网络错误，请稍后重试';
    }
});

// 跳转到注册和忘记密码页面（后续实现页面）
document.getElementById('toRegister').onclick = function(e) {
    e.preventDefault();
    window.location.href = '/register.html';
};
document.getElementById('toForgot').onclick = function(e) {
    e.preventDefault();
    window.location.href = '/forgot.html';
}; 