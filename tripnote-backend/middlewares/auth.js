const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // 取出 Bearer 后的 token

    if (!token) {
        return res.status(401).json({ code: 1001, message: '未登录或token缺失' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // 将用户ID附加到请求对象上供后续使用
        next(); // 验证通过，继续处理请求
    } catch (err) {
        return res.status(401).json({ code: 1002, message: 'Token无效或已过期' });
    }
};

module.exports = verifyToken;
