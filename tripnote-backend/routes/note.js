const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middlewares/auth');
const noteController = require('../controllers/noteController');

const router = express.Router();

// 创建上传目录
const uploadPath = path.join(__dirname, '../uploads');
const imagePath = path.join(uploadPath, 'image');
const videoPath = path.join(uploadPath, 'video');

// 确保目录存在
fs.mkdirSync(imagePath, { recursive: true });
fs.mkdirSync(videoPath, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'images') {
            cb(null, imagePath);
        } else if (file.fieldname === 'video') {
            cb(null, videoPath);
        } else {
            cb(new Error('未知的字段名'), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/upload/image', verifyToken, upload.array('images', 9), noteController.uploadImages);
router.post('/upload/video', verifyToken, upload.single('video'), noteController.uploadVideo);

router.post(
    '/create',
    verifyToken,
    upload.fields([
        { name: 'images', maxCount: 9 },
        { name: 'video', maxCount: 1 }
    ]),
    noteController.createNote
);

router.get('/:id', noteController.getNoteById);

router.get('/', noteController.getNoteList);

router.get('/search', verifyToken, noteController.searchNotes);


router.get('/my-notes', verifyToken, noteController.getNotesByStatus);





module.exports = router;
