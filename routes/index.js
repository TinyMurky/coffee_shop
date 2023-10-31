const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')
const cart = require('./modules/cart')
const product = require('./modules/product')
const event = require('./modules/event')
const order = require('./modules/order')
const email = require('./modules/email')
const { authenticated } = require('../middleware/api-auth')
const errorHandler = require('../middleware/error-handler')

router.use('/auth', auth)
router.use('/cart', authenticated, cart)
router.use('/order', order)
router.use('/products', product) // 需要提供給未登入用戶看
router.use('/events', event)
router.use('/emails', email)

router.use('/', errorHandler)

module.exports = router
