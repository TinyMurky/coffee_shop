'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    stock: DataTypes.NUMBER,
    roast: DataTypes.STRING,
    aroma: DataTypes.NUMBER,
    sour: DataTypes.NUMBER,
    bitter: DataTypes.NUMBER,
    thickness: DataTypes.NUMBER,
    viewCount: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Product',
    underscored: true,
  });
  return Product;
};