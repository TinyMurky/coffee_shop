'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here

      // 一對多
      CartItem.belongsTo(models.Cart)
      CartItem.belongsTo(models.Variant)
      CartItem.belongsTo(models.Product)
    }
  }
  CartItem.init({
    cartId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    variantId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartItem',
    tableName: 'CartItems',
    underscored: true
  })
  return CartItem
}
