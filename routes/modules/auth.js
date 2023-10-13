const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('../../config/passport')

const router = express.Router()

router.get('/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })) // 'email',

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
  })

module.exports = router
