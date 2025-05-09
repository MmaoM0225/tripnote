const { User } = require('../models');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SALT_ROUNDS = 10;

const CODE = {
    SUCCESS: 0,
    SERVER_ERROR: 5000,
    NICKNAME_INVALID: 1001,
    USERNAME_INVALID: 1002,
    PASSWORD_MISMATCH: 1003,
    PASSWORD_INVALID: 1004,
    UNAUTHORIZED: 1001,
    PARAM_ERROR: 1001,
    USERNAME_NOT_FOUND: 1001,
    PASSWORD_INCORRECT: 1001,
    USER_NOT_FOUND: 1001


};

// 注册接口
const register = async (req, res) => {
    const { nickname, username, password, confirmPassword } = req.body;

    try {
        // 1. 检查昵称
        if (!nickname) {
            return res.status(400).json({
                code: CODE.NICKNAME_INVALID,
                message: '用户昵称不合理',
            });
        }
        const existingNickname = await User.findOne({ where: { nickname } });
        if (existingNickname) {
            return res.status(400).json({
                code: CODE.NICKNAME_INVALID,
                message: '用户昵称已存在',
            });
        }

        // 2. 检查账号
        if (!username || username.length < 8) {
            return res.status(400).json({
                code: CODE.USERNAME_INVALID,
                message: '账号不合法，需大于等于8位',
            });
        }
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({
                code: CODE.USERNAME_INVALID,
                message: '账号已存在',
            });
        }

        // 3. 密码一致性检查
        if (password !== confirmPassword) {
            return res.status(400).json({
                code: CODE.PASSWORD_MISMATCH,
                message: '两次密码不一致',
            });
        }

        // 4. 密码合法性检查
        if (!password || password.length < 8) {
            return res.status(400).json({
                code: CODE.PASSWORD_INVALID,
                message: '密码不合法，需大于等于8位',
            });
        }
        // 5. 密码加密
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 6. 创建用户
        const newUser = await User.create({ nickname, username, password: hashedPassword,});

        // 成功状态返回
        res.status(200).json({
            code: CODE.SUCCESS,
            message: '注册成功',
            data: { id: newUser.id, nickname: newUser.nickname }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: CODE.SERVER_ERROR,
            message: '服务器内部错误',
        });
    }
};

// 登录接口
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ code: CODE.USERNAME_NOT_FOUND, message: '账号或密码错误' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ code: CODE.PASSWORD_INCORRECT, message: '账号或密码错误' });
        }

        // 生成 JWT
        const token = jwt.sign(
            { userId: user.id, nickname: user.nickname },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            code: CODE.SUCCESS,
            message: '登录成功',
            data: {
                token,
                user: {
                    id: user.id,
                    nickname: user.nickname,
                    avatar: user.avatar,
                    status: user.status,
                    role: user.role
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: CODE.SERVER_ERROR, message: '服务器内部错误' });
    }
};
// 获取当前用户
const getCurrentUser = async (req, res) => {
    const userId = req.userId; // 来自 verifyToken 中间件

    if (!userId) {
        return res.status(401).json({ code: CODE.UNAUTHORIZED, message: '未授权，请登录' });
    }

    try {
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ code: CODE.UNAUTHORIZED, message: '用户不存在' });
        }

        return res.status(200).json({
            code: CODE.SUCCESS,
            message: '获取用户信息成功',
            data: {
                id: user.id,
                nickname: user.nickname,
                avatar: user.avatar,
                status: user.status,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ code: CODE.SERVER_ERROR, message: '服务器错误' });
    }
};

// 检查用户名或昵称是否存在
const checkExist = async (req, res) => {
    const { type, value } = req.query;

    if (!['username', 'nickname'].includes(type)) {
        return res.status(400).json({ code: CODE.PARAM_ERROR, message: '参数错误' });
    }

    try {
        const where = {};
        where[type] = value;

        const user = await User.findOne({ where });

        return res.status(200).json({
            code: CODE.SUCCESS,
            message: '查询成功',
            data: { exists: !!user },
        });
    } catch (err) {
        console.error('检查是否存在出错：', err);
        return res.status(500).json({ code: CODE.SERVER_ERROR, message: '服务器错误' });
    }
};

const updateAvatar = async (req, res) => {
    const userId = req.userId; // 从 JWT 中解析
    const file = req.file;

    if (!file) {
        return res.status(400).json({ code: 1003, message: '未上传头像文件' });
    }

    const avatarUrl = `uploads/avatars/${file.filename}`;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ code: 1001, message: '用户不存在' });
        }

        user.avatar = avatarUrl;
        await user.save();

        return res.status(200).json({
            code: 0,
            message: '头像更新成功',
            data: {
                avatar: avatarUrl,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ code: 5000, message: '服务器内部错误' });
    }
};

module.exports = {
    updateAvatar,
};


module.exports = {
    register,
    login,
    getCurrentUser,
    checkExist,
    updateAvatar,
};
