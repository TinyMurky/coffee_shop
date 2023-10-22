'use strict'
const { Product, Variant } = require('../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const developers = require('./data/user.json')

    // 先建立root與developer的cart, id 是 1, 2, 3, 4
    const carts = developers.map((_, index) => {
      return {
        id: index + 1,
        user_id: index + 1,
        status: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    await queryInterface.bulkInsert('Carts', carts, {
      upsertKeys: ['id'],
      updateOnDuplicate: ['user_id', 'status']
    })

    // 每個人買3個咖啡豆與3個週邊，都買資料庫最開頭的三筆
    const { id: firstCoffeeId } = await Product.findOne({
      where: {
        isCoffee: true
      },
      attributes: ['id']
    })
    const { id: firstUtensilId } = await Product.findOne({
      where: {
        isCoffee: false
      },
      attributes: ['id']
    })

    // 這段code頗爛，考慮以後重構
    const cartItems = []

    let id = 0
    for (let i = 1; i <= developers.length; i++) {
      for (let j = 1; j <= 3; j++) {
        // coffee product會依照第一筆isCoffee=true的id抓三個，並用productId抓出第一筆的varientId
        id++
        let productId = firstCoffeeId + j
        const { id: coffeeVarientId } = await Variant.findOne({
          where: {
            productId
          },
          attributes: ['id']
        })
        cartItems.push({
          id,
          cart_id: i,
          product_id: productId,
          variant_id: coffeeVarientId,
          quantity: 4,
          created_at: new Date(),
          updated_at: new Date()
        })

        // utensil product會依照第一筆isCoffee=false的id抓三個，並用productId抓出第一筆的varientId
        id++
        productId = firstUtensilId + j
        const { id: utensilVarientId } = await Variant.findOne({
          where: {
            productId
          },
          attributes: ['id']
        })
        cartItems.push({
          id,
          cart_id: i,
          product_id: productId,
          variant_id: utensilVarientId,
          quantity: 4,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('CartItems', cartItems, {
      upsertKeys: ['id'],
      updateOnDuplicate: ['cart_id', 'product_id', 'variant_id', 'quantity']
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carts', null, {})
    await queryInterface.bulkDelete('CartItems', null, {})
  }
}
