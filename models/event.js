'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Event.init({
    name: DataTypes.STRING,
    bannerUrl: DataTypes.STRING,
    discount: DataTypes.FLOAT,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    repeat: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Events',
    underscored: true
  })
  return Event
}
