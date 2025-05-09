const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING,   unique: {name: 'username', msg: '用户名已存在'}, allowNull: false },
    nickname: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING ,allowNull: false, defaultValue: 'uploads/avatar-default.jpg'},
    password: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    role: { type: DataTypes.STRING, defaultValue: 'user' }
}, {
    timestamps: true,
    tableName: 'user'
});

module.exports = User;
