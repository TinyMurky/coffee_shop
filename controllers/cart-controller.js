const cartServices = require('../services/cart-services')

const cartController = {
  getCartItems: (req, res, next) => {
    // const userId = req.user
    cartServices.getCartItems(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  removeCartItem: (req, res, next) => {
    // try {
    //   const userId = req.user.id
    //   const productId = req.params.id
    //   const { quantity, variantName } = req.body
    //   await cartServices.removeCartItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
    // } catch (err) {

    // }
    cartServices.removeCartItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  modifyCartItem: (req, res, next) => {
    cartServices.modifyCartItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = cartController
