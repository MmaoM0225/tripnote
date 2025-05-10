
const { Note, User } = require('../models');
const { Op } = require('sequelize');
const mockData = require('../mockdata/note_2.json');
const BSE_URL = 'http://localhost:3000';
// 上传图片
const uploadImages = (req, res) => {
    try {
        const urls = req.files.map(file => `${BSE_URL}/uploads/image/${file.filename}`);
        res.json({ code: 0, message: '上传成功', data: urls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 1, message: '上传失败', error: error.message });
    }
};

// 上传视频
const uploadVideo = (req, res) => {
    try {
        const url = `${BSE_URL}/uploads/video/${req.file.filename}`;
        res.json({ code: 0, message: '上传成功', data: url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 1, message: '上传失败', error: error.message });
    }
};
const createNote = async (req, res) => {
    try {
        const {
            title,
            content,
            location,
            season,
            duration_days,
            cost,
            image_urls,
            video_url
        } = req.body;

        const userId = req.userId; // 来自 verifyToken 中间件

        const newNote = await Note.create({
            title,
            content,
            location,
            season,
            duration_days,
            cost,
            image_urls,
            video_url,
            user_id: userId
        });

        res.json({ code: 0, message: '发布成功', data: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 1, message: '发布失败', error: error.message });
    }
};

const getNoteById = async (req, res) => {
    try {
        const noteId = req.params.id;

        const note = await Note.findOne({
            where: {
                id: noteId,
                is_deleted: false,
                status: 'approved'

            },
            include: {
                model: User,
                as: 'author',
                attributes: ['id', 'nickname', 'avatar']
            }
        });

        if (!note) {
            return res.status(404).json({ code: 1004, message: '游记不存在' });
        }

        res.json({
            code: 0,
            message: '获取成功',
            data: note
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 1,
            message: '服务器错误',
            error: error.message
        });
    }
};

const getNoteList = async (req, res) => {
    try {
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;

        const notes = await Note.findAll({
            where: { is_deleted: false, status: 'approved' }, // 只返回已审核且未删除的
            include: {
                model: User,
                as: 'author',
                attributes: ['id', 'nickname', 'avatar']
            },
            order: [['createdAt', 'DESC']],
            offset,
            limit
        });

        res.json({
            code: 0,
            message: '获取成功',
            data: {
                total:  notes.length,
                list: notes
            } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 1, message: '服务器错误', error: error.message });
    }
};

const getMockNoteList = (req, res) => {
    try {
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;

        const slicedData = mockData.slice(offset, offset + limit);

        res.json({
            code: 0,
            message: '获取成功（假数据）',
            data: {
                total: mockData.length,
                list: slicedData
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 1, message: '获取假数据失败', error: error.message });
    }
};

const searchNotes = async (req, res) => {
    try {
        const { keyword = '', offset = 0, limit = 10 } = req.query;

        const notes = await Note.findAndCountAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { location: { [Op.like]: `%${keyword}%` } },
                    { season: { [Op.like]: `%${keyword}%` } }
                ],
                is_deleted: false,
                status: 'approved' // 已审核
            },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'nickname'],
                    where: {
                        nickname: { [Op.like]: `%${keyword}%` }
                    },
                    required: false // 允许没有匹配作者
                }
            ],
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            code: 0,
            message: '搜索成功',
            data: {
                total: notes.count,
                list: notes.rows
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 1, message: '搜索失败', error: err.message });
    }
};

const getNotesByStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const { status } = req.query;

        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ code: 1, message: '无效的审核状态' });
        }

        const notes = await Note.findAll({
            where: {
                user_id: userId,
                status,
                is_deleted: false,
            },
            order: [['createdAt', 'DESC']],
        });

        res.json({ code: 0, data: notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 1, message: '获取游记失败', error: error.message });
    }
};


module.exports = {
    uploadImages,
    uploadVideo,
    createNote,
    getNoteById,
    getMockNoteList,
    getNoteList,
    searchNotes,
    getNotesByStatus,


};
