const { Product, Category, SuperCategory, Variant, Image, Sale, Sequelize } = require('../models')
const { getActiveEvent } = require('./event-services')
const activatedHelpers = require('../helpers/event-sale-activated-helper')
const customError = require('../libs/error/custom-error')
const productHelpers = require('../helpers/product-helpers')

const productServices = {
  getAllProducts: async (isUtensil = true) => {
    // 不按照category取資料
    const attributes = productHelpers.chooseProductsAttriubites(isUtensil)

    const productDatas = await Product.findAll({
      where: {
        isCoffee: !isUtensil
      },
      attributes,
      include: [
        {
          model: Image,
          required: true,
          attributes: ['id', 'imgUrl']
        },
        {
          model: Variant,
          required: true,
          attributes: ['id', 'variantName', 'variantPrice', 'variantDescription']
        }
      ],
      required: true,
      order: [['id', 'ASC'], [Variant, 'variantPrice', 'ASC'], [Variant, 'id', 'ASC'], [Image, 'id', 'ASC']]
    })

    if (!productDatas) {
      throw new customError.NotFoundError('Products not found')
    }

    const discountRatio = await productServices.computeDiscountRatio()
    for (const product of productDatas) {
      for (const variant of product.Variants) {
        const originPrice = variant.variantPrice
        variant.dataValues.discountedPrice = Math.ceil(discountRatio * originPrice)
      }
    }
    return productDatas
  },
  getAllProductsGroupByCategory: async () => {
    // 不加raw, nest才會正確顯示結構
    const discountRatio = await productServices.computeDiscountRatio()
    const productsByCategory = await SuperCategory.findAll({
      order: [
        ['id', 'ASC'],
        [Category, 'id', 'ASC'],
        [Category, Product, 'id', 'ASC'],
        [Category, Product, Variant, 'variantPrice', 'ASC'],
        [Category, Product, Variant, 'id', 'ASC'],
        [Category, Product, Image, 'id', 'ASC']
      ],
      required: true,
      attributes: ['id', 'superCategoryName'],
      include: [{
        model: Category,
        required: true,
        attributes: ['id', ['category', 'subCategory']],
        include: [
          {
            model: Product,
            required: true,
            include: [
              {
                model: Image,
                required: true,
                attributes: ['id', 'imgUrl']
              },
              {
                model: Variant,
                required: true,
                attributes: {
                  include: [
                    'id',
                    'variantName',
                    'variantPrice',
                    'variantDescription',
                    [Sequelize.literal(`CEILING (variant_price * ${discountRatio})`), 'discountedPrice']
                  ]
                }
              }
            ]
          }
        ]
      }]
    })

    if (!productsByCategory) {
      throw new customError.NotFoundError('Products not found')
    }

    return productsByCategory
  },
  getProduct: async (id) => {
    const today = new Date()
    const productData = await Product.findByPk(id, {
      required: true,
      include: [
        {
          model: Category,
          required: true,
          attributes: ['category']
        },
        {
          model: Image,
          required: true,
          attributes: ['id', 'imgUrl']
        },
        {
          model: Variant,
          required: true,
          attributes: ['id', 'variantName', 'variantPrice', 'variantDescription']
        },
        {
          model: Sale,
          required: false, // 沒有sale的也要找出來所以不可以true
          as: 'salesOfProduct',
          attributes: ['id', 'name', 'discount', 'threshold'],
          where: {
            ...activatedHelpers.getFullYearCondition(today)
          },
          through: {
            attributes: []
          }
        }
      ],
      order: [[Variant, 'variantPrice', 'ASC'], [Variant, 'id', 'ASC'], [Image, 'id', 'ASC']]
    })

    if (!productData) {
      throw new customError.NotFoundError('Product not found')
    }

    const discountRatio = await productServices.computeDiscountRatio()
    for (const variant of productData.Variants) {
      const originPrice = variant.variantPrice
      variant.dataValues.discountedPrice = Math.ceil(discountRatio * originPrice)
      variant.dataValues.salesOfProduct = productData.dataValues.salesOfProduct
    }
    delete productData.dataValues.salesOfProduct
    return productData
  },
  computeDiscountRatio: async () => {
    const events = await getActiveEvent()
    let discountRatio = 1
    for (const event of events) {
      discountRatio *= event.discount
    }
    return discountRatio
  }
}
module.exports = productServices
