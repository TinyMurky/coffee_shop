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

// cors開放http://localhost:xxxx 和 xxxxx.ngrok-free.app
const whitelist = [/^http:\/\/localhost(:\d+)?$/, /\.ngrok-free\.app$/]
const corsOptions = {
  origin: function (origin, callback) {
    const pastCors = whitelist.some(regex => regex.test(origin))

    if (pastCors || !origin) { // !origin for postman
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

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
const PORT = process.env.PORT || 3001

// other middleware
app.use(methodOverride('_method'))

// 預留middleware
app.use((req, res, next) => {
  next()
})

app.use('/api', routes)
app.listen(PORT, () => console.log(`Coffee shop app listening on port ${PORT}!`))

module.exports = app
