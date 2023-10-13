// routes/modules/auth.js
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

// 引入passport.js幫我驗證
const passport = require('../../config/passport')

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
    successRedirect: '/google.com',
    failureRedirect: 'https://www.facebook.com',
    session: false
  }),
  (req, res) => {
    const token = jwt.sign({ user: { email: req.user.email }, id: req.user.id }, process.env.JWT_SECRET)
    res.status(200).json({
      status: 'success',
      data: {
        token,
        userId: req.user.id
      }
    })
  }

)

module.exports = router
