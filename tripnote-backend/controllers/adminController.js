const { Note, User } = require('../models');

// 获取所有指定状态的游记
const getAllNotesByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        const validStatuses = ['all', 'pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(200).json({ code: 1001, message: '无效的审核状态' });
        }

        const whereClause = { is_deleted: false };
        if (status !== 'all') {
            whereClause.status = status;
        }

        const notes = await Note.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'nickname', 'avatar']
            }]
        });

        res.json({ code: 0, message: '获取成功', data: notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 5000, message: '获取游记失败', error: error.message });
    }
};

// 审核通过
const approveNote = async (req, res) => {
    try {
        const noteId = req.params.id;

        const [updated] = await Note.update(
            { status: 'approved', reject_reason: null },
            { where: { id: noteId, is_deleted: false } }
        );

        if (updated === 0) {
            return res.status(200).json({ code: 1001, message: '游记不存在或已删除' });
        }

        res.json({ code: 0, message: '审核通过' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 5000, message: '操作失败', error: error.message });
    }
};

// 审核拒绝
const rejectNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const { reason } = req.body;

        if (!reason || reason.trim() === '') {
            return res.status(200).json({ code: 1001, message: '请填写拒绝原因' });
        }

        const [updated] = await Note.update(
            { status: 'rejected', reject_reason: reason },
            { where: { id: noteId, is_deleted: false } }
        );

        if (updated === 0) {
            return res.status(200).json({ code: 1001, message: '游记不存在或已删除' });
        }

        res.json({ code: 0, message: '审核拒绝成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 5000, message: '操作失败', error: error.message });
    }
};

// 管理员逻辑删除游记
const deleteNoteByAdmin = async (req, res) => {
    try {
        const noteId = req.params.id;

        const [updated] = await Note.update(
            { is_deleted: true },
            { where: { id: noteId } }
        );

        if (updated === 0) {
            return res.status(200).json({ code: 1001, message: '游记不存在' });
        }

        res.json({ code: 0, message: '删除成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 5000, message: '删除失败', error: error.message });
    }
};

module.exports = {
    getAllNotesByStatus,
    approveNote,
    rejectNote,
    deleteNoteByAdmin,
};
