'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categoryDatas = require('./data/category.json')
    categoryDatas.forEach(categoryData => {
      categoryData.created_at = new Date()
      categoryData.updated_at = new Date()
    })
    // id 直接寫死在 0～3, if有值直接更新
    await queryInterface.bulkInsert('Categories',
      categoryDatas,
      {
        upsertKeys: ['id'],
        updateOnDuplicate: ['category']
      })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
