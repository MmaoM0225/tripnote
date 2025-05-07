const sequelize = require('../config/database');
const User = require('./user');
const Note = require('./note'); // 提前创建好游记模型文件

// 如果有模型间的关联，可以在这里设置
// User.hasMany(Note)
// Note.belongsTo(User)

const db = {
    sequelize,
    User,
    Note,
};

// 启动时同步模型（推荐仅在开发环境中）
sequelize.sync({ alter: true });

module.exports = db;
