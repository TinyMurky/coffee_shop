const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')
const product = require('./modules/product')
const { authenticated } = require('../middleware/api-auth')
const cartController = require('../controllers/cart-controller')
const errorHandler = require('../libs/error/error-handler')
const errorHandler = require('../middleware/error-handler')

router.use('/auth', auth)

// cart
router.get('/cart', cartController.getCartItems)
router.post('/cart/:id', cartController.addCartItem)
router.delete('/cart/:id', cartController.removeCartItem)

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
