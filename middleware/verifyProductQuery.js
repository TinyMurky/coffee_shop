const verifyProductQuery = (req, res, next) => {
  try {
    let { isUtensil } = req.query

    // 確保isCoffee是true, undefined
    isUtensil = isUtensil === 'true' ? true : undefined

    req.isUtensil = isUtensil
    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = verifyProductQuery
