'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Product.hasMany(models.Image, { foreignKey: 'productId' })
      Product.hasMany(models.Variant, { foreignKey: 'productId' })
      Product.hasMany(models.CartItem, { foreignKey: 'productId' })
      Product.hasMany(models.OrderItem, { foreignKey: 'productId' })
      Product.hasMany(models.Comment, { foreignKey: 'productId' })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    roast: DataTypes.STRING,
    aroma: DataTypes.INTEGER,
    sour: DataTypes.INTEGER,
    bitter: DataTypes.INTEGER,
    thickness: DataTypes.INTEGER,
    isCoffee: DataTypes.BOOLEAN,
    viewCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true
  })
  return Product
}
