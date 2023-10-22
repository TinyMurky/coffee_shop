'use strict'
const { Product } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { coffee: coffeeSales, utensil: utensilSales } = require('./data/sales.json')

    // 先建立Sales
    const coffeeSalesForInsert = coffeeSales.map(coffeeSale => {
      const { applyCategory, ...rest } = coffeeSale
      rest.created_at = new Date()
      rest.updated_at = new Date()
      return rest
    })

    const utensilSalesForInsert = utensilSales.map(utensilSale => {
      const { productNameInclude, ...rest } = utensilSale
      rest.created_at = new Date()
      rest.updated_at = new Date()
      return rest
    })
    await queryInterface.bulkInsert(
      'Sales',
      [...coffeeSalesForInsert, ...utensilSalesForInsert],
      {
        upsertKeys: ['id'],
        updateOnDuplicate: ['name', 'discount', 'threshold', 'start_time', 'end_time']
      }
    )

    // 再生成ProductSales
    const products = await Product.findAll({
      attributes: ['id', 'name', 'isCoffee', 'categoryId'],
      raw: true,
      nest: true
    })
    const coffeeProducts = products.filter(product => product.isCoffee === 1)
    const utensilProducts = products.filter(product => product.isCoffee === 0)
    for (const coffeeSale of coffeeSales) {
      const targetProducts = coffeeProducts.filter(coffeeProduct => coffeeProduct.categoryId === coffeeSale.id)

      const productSales = targetProducts.map(targetProduct => {
        return {
          product_id: targetProduct.id,
          sale_id: coffeeSale.id,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
      await queryInterface.bulkInsert('ProductSales', productSales, {})
    }

    for (const utensilSale of utensilSales) {
      const targetProducts = utensilProducts.filter(utensilProduct => utensilProduct.name.includes(utensilSale.productNameInclude))

      const productSales = targetProducts.map(targetProduct => {
        return {
          product_id: targetProduct.id,
          sale_id: utensilSale.id,
          created_at: new Date(),
          updated_at: new Date()
        }
      })

      await queryInterface.bulkInsert('ProductSales', productSales, {})
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductSales', null, {})
    await queryInterface.bulkDelete('Sales', null, {})
  }
}
