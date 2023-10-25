'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categoryDatas = require('./data/category.json')
    const superCategoryDatas = require('./data/superCategory.json')
    categoryDatas.forEach(categoryData => {
      categoryData.created_at = new Date()
      categoryData.updated_at = new Date()
    })
    // id 直接寫死在 0～3, if有值直接更新
    await queryInterface.bulkInsert('Categories',
      categoryDatas,
      {
        upsertKeys: ['id'],
        updateOnDuplicate: ['category', 'super_category_id']
      })

    // super category
    superCategoryDatas.forEach(superCategoryData => {
      superCategoryData.created_at = new Date()
      superCategoryData.updated_at = new Date()
    })
    await queryInterface.bulkInsert('SuperCategories',
      superCategoryDatas,
      {
        upsertKeys: ['id'],
        updateOnDuplicate: ['super_category_name']
      })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
    await queryInterface.bulkDelete('SuperCategories', null, {})
  }
}
