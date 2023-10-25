'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const productDatas = require('./data/product-utensils.json')

    for (const productData of productDatas) {
      const { child, ...product } = productData
      product.view_count = 0
      product.stock = 0
      product.created_at = new Date()
      product.updated_at = new Date()
      product.is_coffee = false
      product.roast = null
      product.aroma = null
      product.sour = null
      product.bitter = null
      product.thickness = null

      const createdProductIndex = await queryInterface.bulkInsert('Products', [product]) // 需要放在array理財能bulkInsert

      // json檔案的命名太糟了改一下名稱
      const imageDatas = child.image
      const variantDatas = child.variant

      // 讓variant可以關聯到正確的product id
      const variants = variantDatas.map(variantData => {
        variantData.product_id = createdProductIndex
        variantData.created_at = new Date()
        variantData.updated_at = new Date()
        return variantData
      })
      await queryInterface.bulkInsert('Variants', variants)

      // 讓image可以關聯到正確的product id
      const images = imageDatas.map(imageData => {
        const image = {}
        image.img_url = imageData
        image.product_id = createdProductIndex
        image.created_at = new Date()
        image.updated_at = new Date()
        return image
      })
      await queryInterface.bulkInsert('Images', images)
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {})
    await queryInterface.bulkDelete('Images', null, {})
    await queryInterface.bulkDelete('Variants', null, {})
  }
}
