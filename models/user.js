'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasOne(models.Cart, {
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING,
    hadSubscribed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
