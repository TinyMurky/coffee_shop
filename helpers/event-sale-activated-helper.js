const { Sequelize } = require('../models')
const Op = Sequelize.Op

const activatedHelpers = {
  // 如果是每年發生的，
  getMonthDayCondition: (date) => {
    return {
      [Op.and]: [
        {
          [Op.or]: [
            // 月份比較大
            Sequelize.where(
              Sequelize.fn('MONTH', Sequelize.col('start_time')),
              {
                [Op.lt]: Sequelize.fn('MONTH', date)
              }
            ),
            {
              // 如果月份一樣比日期
              [Op.and]: [
                Sequelize.where(
                  Sequelize.fn('MONTH', Sequelize.col('start_time')),
                  Sequelize.fn('MONTH', date)
                ),
                Sequelize.where(
                  Sequelize.fn('DAY', Sequelize.col('start_time')), {
                    [Op.lte]: Sequelize.fn('DAY', date)
                  }
                )
              ]
            }
          ]
        },
        {
          [Op.or]: [
            // 月份比較小
            Sequelize.where(
              Sequelize.fn('MONTH', Sequelize.col('end_time')),
              {
                [Op.gt]: Sequelize.fn('MONTH', date)
              }
            ),
            {
              // 如果月份一樣比日期
              [Op.and]: [
                Sequelize.where(
                  Sequelize.fn('MONTH', Sequelize.col('end_time')),
                  Sequelize.fn('MONTH', date)
                ),
                Sequelize.where(
                  Sequelize.fn('DAY', Sequelize.col('end_time')), {
                    [Op.gte]: Sequelize.fn('DAY', date)
                  }
                )
              ]
            }
          ]
        }
      ]

    }
  },
  getFullYearCondition: (date) => {
    // Sequelize.where第二個argument如果沒有運算子就是equel

    return {
      [Op.and]: [Sequelize.where(
        Sequelize.fn('DATE', Sequelize.col('start_time')),
        {
          [Op.lte]: Sequelize.fn('DATE', date)
        }

      ),
      Sequelize.where(
        Sequelize.fn('DATE', Sequelize.col('end_time')),
        {
          [Op.gte]: Sequelize.fn('DATE', date)
        }
      )]
    }
  }
}

module.exports = activatedHelpers
