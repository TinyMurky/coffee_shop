const { Product, Category, Variant, Image } = require('../models')
const { getActiveEvent } = require('./event-services')
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
        },
        {
          model: Variant,
          require: true,
          attributes: ['id', 'variantName', 'variantPrice']
        }
      ],
      require: true
    })

    if (!productDatas) {
      throw new customError.NotFoundError('Products not found')
    }

    for (const product of productDatas) {
      for (const variant of product.Variants) {
        const originPrice = variant.variantPrice
        variant.dataValues.discountedPrice = await productServices.computeDiscountFromVarient(originPrice)
      }
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
            },
            {
              model: Variant,
              require: true,
              attributes: ['id', 'variantName', 'variantPrice']
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

    // 三層迴圈，not efficient
    for (const category of productsByCategory) {
      for (const product of category.Products) {
        for (const variant of product.Variants) {
          const originPrice = variant.variantPrice
          variant.dataValues.discountedPrice = await productServices.computeDiscountFromVarient(originPrice)
        }
      }
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

    for (const variant of productData.Variants) {
      const originPrice = variant.variantPrice
      variant.dataValues.discountedPrice = await productServices.computeDiscountFromVarient(originPrice)
    }
    return productData
  },
  computeDiscountFromVarient: async (originPrice) => {
    const events = await getActiveEvent()
    for (const event of events) {
      originPrice *= event.discount
    }
    return Math.ceil(originPrice)
  }
}
module.exports = productServices
