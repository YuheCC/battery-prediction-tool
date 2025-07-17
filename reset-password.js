// 获取 URL 中的 token
function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
}

document.getElementById('resetForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const code = document.getElementById('code').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('resetMessage');
    messageDiv.textContent = '';

    // 邮箱格式校验
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) {
        messageDiv.textContent = '邮箱格式不正确';
        return;
    }

    // 验证码校验
    if (!code) {
        messageDiv.textContent = '请输入验证码';
        return;
    }

    // 密码强度校验
    if (!/^.*(?=.*[a-zA-Z])(?=.*\d).{8,30}.*$/.test(password)) {
        messageDiv.textContent = '密码需8-30位，且包含字母和数字';
        return;
    }

    try {
        const res = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code, newPassword: password })
        });
        const data = await res.json();
        if (res.ok) {
            messageDiv.style.color = '#27ae60';
            messageDiv.textContent = '密码重置成功，请返回登录';
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            messageDiv.style.color = '#e74c3c';
            messageDiv.textContent = data.message || '重置失败';
        }
    } catch (err) {
        messageDiv.textContent = '网络错误，请稍后重试';
    }
}); 