const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    image_urls: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const raw = this.getDataValue('image_urls');
            return raw ? JSON.parse(raw) : [];
        },
        set(val) {
            this.setDataValue('image_urls', JSON.stringify(val));
        }
    },
    video_url: { type: DataTypes.STRING(500), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    location: { type: DataTypes.STRING(255), allowNull: true },
    season: {
        type: DataTypes.ENUM('春季', '夏季', '秋季', '冬季'),
        allowNull: true
    },
    duration_days: { type: DataTypes.INTEGER, allowNull: true },
    cost: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    reject_reason: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '拒绝原因',
    },
}, {
    timestamps: true,
    tableName: 'note'
});

module.exports = Note;
