'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here

      Order.hasMany(models.OrderItem, { foreignKey: 'orderId' })
    }
  }
  Order.init({
    email: DataTypes.STRING,
    totalPrice: DataTypes.INTEGER,
    status: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true
  })
  return Order
}
