'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const eventDatas = require('./data/event.json')
    eventDatas.forEach(eventData => {
      eventData.created_at = new Date()
      eventData.updated_at = new Date()
    })
    await queryInterface.bulkInsert('Events', eventDatas, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {})
  }
}
