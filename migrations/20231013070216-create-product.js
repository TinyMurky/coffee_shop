'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.NUMBER
      },
      roast: {
        type: Sequelize.STRING
      },
      aroma: {
        type: Sequelize.NUMBER
      },
      sour: {
        type: Sequelize.NUMBER
      },
      bitter: {
        type: Sequelize.NUMBER
      },
      thickness: {
        type: Sequelize.NUMBER
      },
      view_count: {
        type: Sequelize.NUMBER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products')
  }
}
