// middlewares/requireAdminOrReviewer.js
const { User } = require('../models');

const requireAdminOrReviewer = async (req, res, next) => {
    const user = await User.findByPk(req.userId);
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
        return res.status(403).json({ code: 1003, message: '无权限操作' });
    }
    req.user = user; // 可选：挂载完整 user
    next();
};

module.exports = requireAdminOrReviewer;
