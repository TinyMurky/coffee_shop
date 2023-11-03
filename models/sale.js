'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // 多對多關係
      Sale.belongsToMany(models.Product, // 多對多關係
        {
          through: models.ProductSale,
          foreignKey: 'saleId',
          as: 'effectedProductsOfSale'
        }
      )
    }
  }
  Sale.init({
    // productId: DataTypes.INTEGER,
    name: DataTypes.INTEGER,
    discount: DataTypes.FLOAT,
    threshold: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Sale',
    tableName: 'Sales',
    underscored: true
  })
  return Sale
}
