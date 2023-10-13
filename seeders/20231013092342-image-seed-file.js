'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const productDatas = require('./data/product.json')
    const imageData = productDatas.map(product => ({
      imgUrl: product.child.image[0],
      product_id: productDatas.indexOf(product) + 1,
      created_at: new Date(),
      updated_at: new Date()
    }))

    await queryInterface.bulkInsert('Images', imageData)
  },

  async  down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {})
  }
}
