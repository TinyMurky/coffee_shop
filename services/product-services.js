const { Product } = require('../models')
const pagiHelper = require('../helpers/pagination-helpers')
const customError = require('../libs/error/custom-error')
const productHelpers = require('../helpers/product-helpers')
const productServices = {
  getAllProducts: async ({ isCoffee = true, limit = null, page = 0 } = {}) => {
    const offset = pagiHelper.getOffset(limit, page)

    const attributes = productHelpers.chooseProductsAttriubites(isCoffee)

    const productDatas = await Product.findAll({
      where: {
        isCoffee
      },
      attributes,
      require: true,
      raw: true,
      nest: true,
      offset,
      limit
    })

    if (!productDatas) {
      throw new customError.NotFoundError('Products not found')
    }

    return productDatas
  },
  getProduct: async (id, hideFlavor = false) => {
    const attributes = productHelpers.chooseProductsAttriubites(!hideFlavor) // hideFlavor是 isCoffee的相反

    const productData = await Product.findByPk(id, {
      attributes,
      require: true
    })

    if (!productData) {
      throw new customError.NotFoundError('Product not found')
    }

    return productData.toJSON()
  }
}
module.exports = productServices
