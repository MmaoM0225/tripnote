const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/auth');
const requireAdminOrReviewer = require('../middlewares/requireAdminOrReviewer');

// 获取所有游记（审核端）按状态筛选
router.get('/notes', verifyToken, requireAdminOrReviewer, adminController.getAllNotesByStatus);

// 审核操作
router.put('/notes/:id/approve', verifyToken, requireAdminOrReviewer, adminController.approveNote);
router.put('/notes/:id/reject', verifyToken, requireAdminOrReviewer, adminController.rejectNote);

// 删除游记（只有管理员可以删除）
router.delete('/notes/:id', verifyToken, requireAdminOrReviewer, adminController.deleteNoteByAdmin);

module.exports = router;
