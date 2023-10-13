// 第三方套件
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env' })
}
const cors = require('cors')
const express = require('express')
const methodOverride = require('method-override')
const path = require('path')

const passport = require('./config/passport')
const routes = require('./routes')

// app init
const app = express()
app.use(cors())

// Bodyparser設定
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // for test

// passport 初始化
app.use(passport.initialize())
// app.use(passport.session())

// static folder
app.use(express.static(path.join(__dirname, 'public'))) // for css and 前端js
app.use('/upload', express.static(path.join(__dirname, 'upload')))

// PORT
const PORT = process.env.PORT || 3000

// other middleware
app.use(methodOverride('_method'))

// 預留middleware
app.use((req, res, next) => {
  next()
})

app.use('/api', routes)
app.listen(PORT, () => console.log(`Coffee shop app listening on port ${PORT}!`))

module.exports = app
