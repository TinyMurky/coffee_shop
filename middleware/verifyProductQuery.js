const customError = require('../libs/error/custom-error')
const verifyProductQuery = (req, res, next) => {
  try {
    let { isCoffee, limit, page } = req.query

    // 確保isCoffee是true, false or undefined
    isCoffee = isCoffee === 'true' ? true : (isCoffee === 'false' ? false : undefined)

    // 確保limit和page是數字
    if (limit !== undefined) {
      limit = parseInt(limit)
      if (!Number.isInteger(limit)) {
        throw new customError.CustomError('Page不是數字或undefined', 'TypeError', 400) // 400 Bad Request
      }
    }

    if (page !== undefined) {
      page = parseInt(page)
      if (!Number.isInteger(page)) {
        throw new customError.CustomError('limit不是數字或undefined', 'TypeError', 400) // 400 Bad Request
      }
    }
    req.isCoffee = isCoffee
    req.limit = limit
    req.page = page
    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = verifyProductQuery
