const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/auth');

// 获取所有游记（审核端）按状态筛选
router.get('/notes', adminController.getAllNotesByStatus);

// 审核操作
router.put('/notes/:id/approve',verifyToken, adminController.approveNote);
router.put('/notes/:id/reject',verifyToken, adminController.rejectNote);
router.delete('/notes/:id', verifyToken, adminController.deleteNoteByAdmin);

module.exports = router;
