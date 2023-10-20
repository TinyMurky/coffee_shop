const customError = require('../libs/error/custom-error')
const productServices = require('../services/product-services')
const productController = {
  getAllProducts: async (req, res, next) => {
    try {
      const { isUtensil } = req

      let productDatas
      if (isUtensil) {
        productDatas = await productServices.getAllProducts(isUtensil)
      } else {
        productDatas = await productServices.getAllProductsGroupByCategory()
      }

      const response = {
        status: 'success',
        data: productDatas
      }

      return res.status(200).json(response)
    } catch (error) {
      return next(error)
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const productId = req.params.id
      if (isNaN(productId)) {
        throw new customError.CustomError('提供的id不是數字', 'TypeError', 400) // 400 Bad Request
      }

      const productData = await productServices.getProduct(productId)

      const response = {
        status: 'success',
        data: productData
      }

      return res.status(200).json(response)
    } catch (error) {
      return next(error)
    }
  }
}
module.exports = productController
