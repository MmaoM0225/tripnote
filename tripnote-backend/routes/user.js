const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userController = require('../controllers/userController')
const verifyToken = require('../middlewares/auth');


const router = express.Router()
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/check', userController.checkExist);

router.get('/current', verifyToken,userController.getCurrentUser)

// 配置上传目录和文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/avatars');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage });

router.post('/updateAvatar', verifyToken, upload.single('avatar'), userController.updateAvatar);


module.exports = router
