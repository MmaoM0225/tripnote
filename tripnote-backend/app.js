const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()

app.use(cors())
app.use(bodyParser.json())

// 引入用户路由
const userRoutes = require('./routes/user')
app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
