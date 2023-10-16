'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const paymentMethodDatas = require('./data/payment-method.json')
    const defaultPaymentMethods = paymentMethodDatas.map(data => {
      return {
        payment_method: data.name,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    await queryInterface.bulkInsert('PaymentMethods', defaultPaymentMethods)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PaymentMethods', null, {})
  }
}
