const BASE_URL = 'http://localhost:3002';

async function testAPI() {
    console.log('🧪 开始测试API接口...\n');

    // 测试注册接口
    console.log('1. 测试注册接口...');
    try {
        const registerResponse = await fetch(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lastName: '测试',
                firstName: '用户',
                email: 'test@example.com',
                password: 'Test1234'
            })
        });
        const registerData = await registerResponse.json();
        console.log(`   注册结果: ${registerResponse.ok ? '✅' : '❌'} ${registerData.message}`);
    } catch (error) {
        console.log(`   注册失败: ❌ ${error.message}`);
    }

    // 测试登录接口（使用已存在的用户）
    console.log('\n2. 测试登录接口...');
    try {
        const loginResponse = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'zhangsan@example.com',
                password: 'Test1234'
            })
        });
        const loginData = await loginResponse.json();
        console.log(`   登录结果: ${loginResponse.ok ? '✅' : '❌'} ${loginData.message}`);
    } catch (error) {
        console.log(`   登录失败: ❌ ${error.message}`);
    }

    // 测试忘记密码接口
    console.log('\n3. 测试忘记密码接口...');
    try {
        const forgotResponse = await fetch(`${BASE_URL}/api/forgot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'zhangsan@example.com'
            })
        });
        const forgotData = await forgotResponse.json();
        console.log(`   忘记密码结果: ${forgotResponse.ok ? '✅' : '❌'} ${forgotData.message}`);
    } catch (error) {
        console.log(`   忘记密码失败: ❌ ${error.message}`);
    }

    // 测试获取用户信息接口
    console.log('\n4. 测试获取用户信息接口...');
    try {
        const userResponse = await fetch(`${BASE_URL}/api/user/zhangsan@example.com`);
        const userData = await userResponse.json();
        console.log(`   获取用户信息结果: ${userResponse.ok ? '✅' : '❌'} ${userData.firstName} ${userData.lastName}`);
    } catch (error) {
        console.log(`   获取用户信息失败: ❌ ${error.message}`);
    }

    // 测试邮箱验证接口
    console.log('\n5. 测试邮箱验证接口...');
    try {
        const verifyResponse = await fetch(`${BASE_URL}/api/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                code: '123456'
            })
        });
        const verifyData = await verifyResponse.json();
        console.log(`   邮箱验证结果: ${verifyResponse.ok ? '✅' : '❌'} ${verifyData.message}`);
    } catch (error) {
        console.log(`   邮箱验证失败: ❌ ${error.message}`);
    }

    console.log('\n🎉 API测试完成！');
}

// 运行测试
testAPI().catch(console.error); 