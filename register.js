document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('registerMessage');
    messageDiv.textContent = '';

    // 邮箱格式校验
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) {
        messageDiv.textContent = '邮箱格式不正确';
        return;
    }
    // 密码强度校验
    if (!/^.*(?=.*[a-zA-Z])(?=.*\d).{8,30}.*$/.test(password)) {
        messageDiv.textContent = '密码需8-30位，且包含字母和数字';
        return;
    }
    // 确认密码校验
    if (password !== confirmPassword) {
        messageDiv.textContent = '两次输入的密码不一致';
        return;
    }
    if (!lastName || !firstName) {
        messageDiv.textContent = '请输入姓名';
        return;
    }

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lastName, firstName, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            messageDiv.style.color = '#27ae60';
            messageDiv.textContent = '注册成功，请前往邮箱验证后登录';
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            messageDiv.style.color = '#e74c3c';
            messageDiv.textContent = data.message || '注册失败';
        }
    } catch (err) {
        messageDiv.textContent = '网络错误，请稍后重试';
    }
}); 