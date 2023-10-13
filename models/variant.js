'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Variant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Variant.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }
  Variant.init({
    productId: DataTypes.INTEGER,
    variantName: DataTypes.STRING,
    variantPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Variant',
    tableName: 'Variant',
    underscored: true
  })
  return Variant
}
