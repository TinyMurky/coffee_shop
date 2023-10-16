const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')
const product = require('./modules/product')
const { authenticated } = require('../middleware/api-auth')
const errorHandler = require('../middleware/error-handler')

router.use('/auth', auth)
router.use('/products', authenticated, product)
router.get('/', (req, res) => {
  res.send('<h1>hi</h1>')
})

router.get('/testFacebook', authenticated, (req, res) => {
  res.send({
    status: 'success',
    message: 'login success facebook'
  })
})
router.get('/testLogin', authenticated, (req, res) => {
  res.send({
    status: 'success',
    message: 'Login success'
  })
})

router.use('/api/user', auth)
router.use('/', errorHandler)

module.exports = router
