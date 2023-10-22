'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ProductSale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  ProductSale.init({
    productId: DataTypes.INTEGER,
    saleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductSale',
    tableName: 'ProductSales',
    underscored: true
  })
  return ProductSale
}
