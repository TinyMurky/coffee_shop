const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart-controller')

router.get('/', cartController.getCartItems)
router.post('/:id', cartController.addCartItem)
router.delete('/:id', cartController.removeCartItem)

module.exports = router
