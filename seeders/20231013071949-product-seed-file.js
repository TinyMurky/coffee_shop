'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const productDatas = require('./data/product.json')
    const products = productDatas.map(productData => {
      const { child, ...product } = productData
      product.view_count = 0
      product.stock = 0
      product.created_at = new Date()
      product.updated_at = new Date()
      return product
    })

    await queryInterface.bulkInsert('Products', products)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
