const cartServices = require('../services/cart-services')

const cartController = {
  getCartItems: (req, res, next) => {
    // const userId = req.user
    cartServices.getCartItems(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  removeCartItem: (req, res, next) => {
    cartServices.removeCartItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  addCartItem: (req, res, next) => {
    cartServices.addCartItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = cartController
