const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');


const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 引入用户路由
const userRoutes = require('./routes/user')
app.use('/api/user', userRoutes)
// 引入笔记路由
const noteRoutes = require('./routes/note');
app.use('/api/note', noteRoutes);
// 引入管理员路由
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
