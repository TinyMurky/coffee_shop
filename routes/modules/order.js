const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')

router.post('/', orderController.createOrder)
router.post('/check', orderController.getAllOrders)
router.delete('/:id', orderController.removeOrder)

module.exports = router
