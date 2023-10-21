const customError = require('../libs/error/custom-error')
const { Event, Sequelize } = require('../models')
const Op = Sequelize.Op
const discountHelper = {
  getCartDiscountePrice: async (cartItem) => {
    // 注意！ cartItem是Sequelize物件
    const quantity = cartItem.quantity

    let originPrice = cartItem?.Variant?.variantPrice
    if (!originPrice) {
      throw new customError.CustomError('CartItem need variant price', 'TypeError', 400)
    }

    const discountObjects = cartItem?.Product?.salesOfProduct
    if (!discountObjects) {
      return originPrice
    }

    // 把所有discount 乘起來
    for (const discountObject of discountObjects) {
      const { startTime, endTime, discount, threshold } = discountObject
      // 不在期間內的就跳過
      if (!discountHelper.isSaleActiveToday(startTime, endTime) || !discountHelper.isLargerThenThreshold(quantity, threshold)) {
        continue
      }
      originPrice *= discount
    }

    // 會直接取出當天activate的event所以不用額外檢查
    const events = await discountHelper.getActiveEvent()
    for (const event of events) {
      originPrice *= event.discount
    }

    return Math.ceil(originPrice)
  },
  isSaleActiveToday: (startTime, endTime) => {
    const today = new Date()
    const startDate = new Date(startTime)
    const endDate = new Date(endTime)

    return (today >= startDate && today <= endDate)
  },
  isLargerThenThreshold: (value, threshold) => {
    return value >= threshold
  },
  getActiveEvent: async () => {
    // Sequelize.fn('DATE(SQL語法)', 要算哪個欄位), 欄位別名)
    // 因為時間儲存是DATETIME2023-10-01 00:00:00，會讓最後一天在凌晨之後會無效
    // 所以我們要
    const today = new Date()

    // 如果是每年發生的，
    const getMonthDayCondition = (date) => {
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
    }

    const getFullYearCondition = (date) => {
      // Sequelize.where第二個argument如果沒有運算子就是equel
      return {
        [Op.and]: [Sequelize.where(
          Sequelize.fn('DATE', Sequelize.col('start_time')),
          {
            [Op.lte]: Sequelize.fn('DATE', today)
          }

        ),
        Sequelize.where(
          Sequelize.fn('DATE', Sequelize.col('end_time')),
          {
            [Op.gte]: Sequelize.fn('DATE', today)
          }
        )]
      }
    }

    const events = await Event.findAll({
      raw: true,
      nest: true,
      require: true,
      where: {
        [Op.or]: [
          {
            repeat: 1,
            ...getMonthDayCondition(today)
          },
          {
            repeat: 0,
            ...getFullYearCondition(today)
          }
        ]
      }
    })
    return events
  }
}
module.exports = discountHelper
