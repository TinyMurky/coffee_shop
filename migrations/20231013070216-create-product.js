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
      category_id: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.INTEGER
      },
      roast: {
        type: Sequelize.STRING
      },
      aroma: {
        type: Sequelize.INTEGER
      },
      sour: {
        type: Sequelize.INTEGER
      },
      bitter: {
        type: Sequelize.INTEGER
      },
      thickness: {
        type: Sequelize.INTEGER
      },
      is_coffee: {
        type: Sequelize.BOOLEAN
      },
      view_count: {
        type: Sequelize.INTEGER
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
