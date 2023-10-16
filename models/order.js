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
      Order.belongsTo(models.PaymentMethod)
      Order.belongsTo(models.User)

      Order.hasMany(models.OrderItem, { foreignKey: 'orderId' })
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    paymentMethodId: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true
  })
  return Order
}