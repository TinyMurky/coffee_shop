// routes/modules/auth.js
const express = require('express')
const router = express.Router()

// 引入passport.js幫我驗證
const passport = require('passport')

// 此路由為畫面上的按鈕 告訴fb我要索取哪些資料
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  })
)

// 利用passport幫我做身份驗證
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    // 設定成功或失敗分別要做什麼事情
    successRedirect: '/google.com',
    failureRedirect: '/facebook.com'
  })
)

module.exports = router
