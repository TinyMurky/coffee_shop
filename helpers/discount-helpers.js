const customError = require('../libs/error/custom-error')
const { getActiveEvent } = require('../services/event-services')
const discountHelper = {
  getCartDiscountPrice: async (cartItem) => {
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
    const events = await getActiveEvent()
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
  }
}
module.exports = discountHelper
