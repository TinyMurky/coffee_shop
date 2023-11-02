const orderServices = require('../services/order-services')
const customError = require('../libs/error/custom-error')
const validator = require('email-validator')
const emailService = require('../services/email.services')

const orderController = {
  createOrder: async (req, res, next) => {
    try {
      const { email, orders } = req.body
      // 先驗證輸入格式為email

      if (validator.validate(email)) {
        await emailService.sendOrderedEmail(email, 'www.google.com')
        return res.status(200).json({
          status: 'success',
          data: await orderServices.createOrder(email, orders)
        })
      } else {
        throw new customError.CustomError('the format of email is invalid', 'TypeError', 400)
      }
    } catch (error) {
      return next(error)
    }
  },
  getAllOrders: async (req, res, next) => {
    try {
      const { email } = req.body

      if (validator.validate(email)) {
        return res.status(200).json({
          status: 'success',
          data: await orderServices.getAllOrders(email)
        })
      } else {
        throw new customError.CustomError('the format of email is invalid', 'TypeError', 400)
      }
    } catch (err) {
      next(err)
    }
  },
  removeOrder: async (req, res, next) => {
    try {
      const orderId = req.params.id
      await orderServices.removeOrder(orderId)
      return res.status(200).json({
        status: 'success',
        message: 'successfully deleted order'
      })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = orderController
