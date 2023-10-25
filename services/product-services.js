const { Product, Category, Variant, Image } = require('../models')
const { getActiveEvent } = require('./event-services')
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
    const productsByCategory = await Category.findAll({
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
              attributes: ['id', 'variantName', 'variantPrice', 'variantDescription']
            }
          ]
        }
      ],
      order: [['id', 'ASC'], [Product, 'id', 'ASC'], [Product, Variant, 'variantPrice', 'ASC'], [Product, Variant, 'id', 'ASC'], [Product, Image, 'id', 'ASC']],
      attributes: ['id', ['category', 'subCategoryName'], 'isCoffee'],
      required: true
    })

    if (!productsByCategory) {
      throw new customError.NotFoundError('Products not found')
    }

    // 三層迴圈，not efficient
    const discountRatio = await productServices.computeDiscountRatio()
    for (const category of productsByCategory) {
      for (const product of category.Products) {
        for (const variant of product.Variants) {
          const originPrice = variant.variantPrice
          variant.dataValues.discountedPrice = Math.ceil(discountRatio * originPrice)
        }
      }
    }

    const coffees = productsByCategory.filter(category => category.isCoffee)
    const utensil = productsByCategory.filter(category => !category.isCoffee)
    const response = [
      {
        id: 1,
        mainCategory: '咖啡豆, 濾掛式',
        subCategory: coffees
      },
      {
        id: 2,
        mainCategory: '咖啡器材',
        subCategory: utensil
      }
    ]
    return response
  },
  getProduct: async (id) => {
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
    }
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
