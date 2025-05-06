exports.register = (req, res) => {
    const { nickname, username, password } = req.body
    // 模拟注册逻辑
    console.log('注册请求:', req.body)
    res.json({ success: true, message: '注册成功' })
}

exports.login = (req, res) => {
    const { username, password } = req.body
    // 模拟登录逻辑
    if (username === 'test' && password === '12345678') {
        res.json({ success: true, token: 'mock-token' })
    } else {
        res.status(401).json({ success: false, message: '用户名或密码错误' })
    }
}
