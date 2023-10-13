// routes/modules/auth.js
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { getToken } = require('../../middleware/get-token')

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
  getToken)

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
  getToken
)

module.exports = router
