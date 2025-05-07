require('dotenv').config(); // 引入 dotenv

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,     // 数据库名
    process.env.DB_USER,     // 用户名
    process.env.DB_PASSWORD, // 密码
    {
        host: process.env.DB_HOST, // 主机
        port: process.env.DB_PORT, // 端口（一般3306）
        dialect: 'mysql',
        logging: false, // 禁用日志输出
    }
);

module.exports = sequelize;
