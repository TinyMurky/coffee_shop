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

      Variant.hasMany(models.CartItem, { foreignKey: 'variantId' })
      Variant.hasMany(models.OrderItem, { foreignKey: 'variantId' })
    }
  }
  Variant.init({
    productId: DataTypes.INTEGER,
    variantName: DataTypes.STRING,
    variantPrice: DataTypes.INTEGER,
    variantDescription: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Variant',
    tableName: 'Variants',
    underscored: true
  })
  return Variant
}
