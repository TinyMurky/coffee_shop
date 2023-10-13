const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')
const { authenticated } = require('../middleware/api-auth')

router.get('/', (req, res) => {
  res.send('<h1>hi</h1>')
})

router.get('/testFacebook', authenticated, (req, res) => {
  res.send({
    status: 'success',
    message: 'login success facebook'
  })
})
router.use('/api/user', auth)

module.exports = router
