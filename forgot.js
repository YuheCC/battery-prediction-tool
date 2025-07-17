document.getElementById('forgotForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const messageDiv = document.getElementById('forgotMessage');
    const submitBtn = this.querySelector('button[type="submit"]');
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    // 邮箱格式校验
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) {
        messageDiv.textContent = '邮箱格式不正确';
        return;
    }

    // 按钮禁用，防止重复提交
    submitBtn.disabled = true;
    submitBtn.style.opacity = 0.6;

    // 无论请求结果如何都显示"邮件已发送"
    messageDiv.className = 'message message-info';
    messageDiv.textContent = '重置邮件已发送，请查收邮箱';

    try {
        await fetch('/api/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        // 不处理返回内容，始终显示成功
    } catch (err) {
        // 忽略异常，始终显示成功
    }

    // 3秒后恢复按钮
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = 1;
    }, 3000);
}); 