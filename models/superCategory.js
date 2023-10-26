'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class SuperCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      SuperCategory.hasMany(models.Category, { foreignKey: 'superCategoryId' })
    }
  }
  SuperCategory.init({
    superCategoryName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SuperCategory',
    tableName: 'SuperCategories',
    underscored: true
  })
  return SuperCategory
}
