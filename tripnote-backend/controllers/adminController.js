const { Note, User } = require('../models');
const getAllNotesByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        const validStatuses = ['all', 'pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ code: 1, message: '无效的审核状态' });
        }

        const whereClause = {
            is_deleted: false,
        };

        if (status !== 'all') {
            whereClause.status = status;
        }

        const notes = await Note.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'nickname', 'avatar'],
                },
            ],
        });

        res.json({ code: 0, data: notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 1, message: '获取游记失败', error: error.message });
    }
};

// 通过审核
const approveNote = async (req, res) => {
    try {
        const noteId = req.params.id;

        await Note.update(
            { status: 'approved' },
            { where: { id: noteId, is_deleted: false } }
        );

        res.json({ code: 0, message: '审核通过' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '操作失败', error: err.message });
    }
};

// 拒绝审核
const rejectNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ code: 1, message: '请填写拒绝原因' });
        }

        await Note.update(
            { status: 'rejected', reject_reason: reason },
            { where: { id: noteId, is_deleted: false } }
        );

        res.json({ code: 0, message: '审核拒绝成功' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '操作失败', error: err.message });
    }
};

// 逻辑删除游记
const deleteNoteByAdmin = async (req, res) => {
    try {
        const noteId = req.params.id;

        await Note.update(
            { is_deleted: true },
            { where: { id: noteId } }
        );

        res.json({ code: 0, message: '删除成功' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '删除失败', error: err.message });
    }
};

module.exports = {
    getAllNotesByStatus,
    approveNote,
    rejectNote,
    deleteNoteByAdmin,
}