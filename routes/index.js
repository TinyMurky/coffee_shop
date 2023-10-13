const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')

const { authenticated } = require('../middleware/api-auth')

router.use('/auth', auth)
router.get('/', (req, res) => {
  res.send('<h1>hi</h1>')
})

router.get('/testLogin', authenticated, (req, res) => {
  res.send({
    status: 'success',
    message: 'Login success'
  })
})
module.exports = router
