const { Product, Category, Variant, Image } = require('../models')
const { getAllProducts, getActiveEvent } = require('./event-services')
const customError = require('../libs/error/custom-error')
const productHelpers = require('../helpers/product-helpers')

const productServices = {
  getAllProducts: async (isUtensil = true) => {
    const attributes = productHelpers.chooseProductsAttriubites(isUtensil)

    const productDatas = await Product.findAll({
      where: {
        isCoffee: !isUtensil
      },
      attributes,
      include: [
        {
          model: Image,
          require: true,
          attributes: ['id', 'imgUrl']
        }
      ],
      require: true
    })

    if (!productDatas) {
      throw new customError.NotFoundError('Products not found')
    }

    return productDatas
  },
  getAllProductsGroupByCategory: async () => {
    // 不加raw, nest才會正確顯示結構
    const productsByCategory = await Category.findAll({
      include: [
        {
          model: Product,
          require: true,
          include: [
            {
              model: Image,
              require: true,
              attributes: ['id', 'imgUrl']
            }
          ]
        }
      ],
      order: [[Product, 'id', 'ASC']],
      attributes: ['id', 'category'],
      require: true
    })

    if (!productsByCategory) {
      throw new customError.NotFoundError('Products not found')
    }

    return productsByCategory
  },
  getProduct: async (id) => {
    const productData = await Product.findByPk(id, {
      require: true,
      include: [
        {
          model: Image,
          require: true,
          attributes: ['id', 'imgUrl']
        },
        {
          model: Variant,
          require: true,
          attributes: ['id', 'variantName', 'variantPrice']
        }
      ]
    })

    if (!productData) {
      throw new customError.NotFoundError('Product not found')
    }

    const events = await getActiveEvent()

    for (const variant of productData.Variants) {
      let discountedPrice = variant.variantPrice
      for (const event of events) {
        discountedPrice *= event.discount
      }
      variant.dataValues.discountedPrice = Math.ceil(discountedPrice)
    }
    console.log(productData)
    return productData
  }
}
module.exports = productServices
