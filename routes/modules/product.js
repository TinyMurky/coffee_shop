const express = require('express')
const router = express.Router()
const verifyProductQuery = require('../../middleware/verifyProductQuery')
const productController = require('../../controllers/product-controller')

router.get('/:id', productController.getProduct)
router.get('/', verifyProductQuery, productController.getAllProducts)

module.exports = router
