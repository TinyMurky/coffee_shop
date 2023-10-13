// routes/modules/auth.js
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const passport = require('../../config/passport')

// FACEBOOK
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  })
)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: 'https://www.facebook.com',
    session: false
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(req.user)
    const token = jwt.sign({ user: { email: req.user.email }, id: req.user.id }, process.env.JWT_SECRET)
    res.status(200).json({
      status: 'success',
      data: {
        token,
        userId: req.user.id
      }
    })
  })

// GOOGLE
router.get('/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }))
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://www.google.com', session: false }),
  function (req, res) {
    // Successful authentication, redirect home.
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
