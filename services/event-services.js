const { Event, Sequelize } = require('../models')
const Op = Sequelize.Op
const activatedHelpers = require('../helpers/event-sale-activated-helper')

const expenseServices = {
  getActiveEvent: async () => {
    // Sequelize.fn('DATE(SQL語法)', 要算哪個欄位), 欄位別名)
    // 因為時間儲存是DATETIME2023-10-01 00:00:00，會讓最後一天在凌晨之後會無效
    // 所以我們要
    const today = new Date()

    const events = await Event.findAll({
      raw: true,
      nest: true,
      require: true,
      where: {
        [Op.or]: [
          {
            repeat: 1,
            ...activatedHelpers.getMonthDayCondition(today)
          },
          {
            repeat: 0,
            ...activatedHelpers.getFullYearCondition(today)
          }
        ]
      }
    })
    return events
  }
}

module.exports = expenseServices
