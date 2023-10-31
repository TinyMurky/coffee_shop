const cartServices = require('../services/cart-services')
const customError = require('../libs/error/custom-error')

const cartController = {
  getCartItems: (req, res, next) => {
    cartServices.getCartItems(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  removeCartItem: (req, res, next) => {
    cartServices.removeCartItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  modifyCartItem: (req, res, next) => {
    cartServices.modifyCartItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getCartItem: async (req, res, next) => {
    try {
      const { id } = req.params
      if (id === null || isNaN(Number(id))) {
        throw new customError.CustomError('id is required and need to be number', 'TypeError', 400)
      }

      return res.status(200).json({
        status: 'success',
        data: await cartServices.getCartItem(id)
      })
    } catch (error) {
      return next(error)
    }
  }
}
module.exports = cartController
