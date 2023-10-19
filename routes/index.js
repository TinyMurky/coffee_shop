const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')
const cart = require('./modules/cart')
const product = require('./modules/product')
const { authenticated } = require('../middleware/api-auth')
const errorHandler = require('../middleware/error-handler')

router.use('/auth', auth)
router.use('/cart', authenticated, cart)
router.use('/products', product)

router.use('/', errorHandler)

module.exports = router
