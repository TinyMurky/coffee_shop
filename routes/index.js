const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')

const { authenticated } = require('../middleware/api-auth')
const errorHandler = require('../libs/error/error-handler')

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

// handle errors
router.use('/', errorHandler)

module.exports = router
