const emailService = require('../services/email.services')
const emailController = {
  sendOrderedEmail: async (req, res, next) => {
    try {
    // 暫時先用query存入
      // 之後會與order結合，此middleware僅作為測試使用
      const { to: sendEmailTo } = req.query
      const redirectTo = 'www.google.com'
      const info = await emailService.sendOrderedEmail(sendEmailTo, redirectTo)
      const response = {
        status: 'success',
        message: `Message sent:${info.messageId}`
      }
      return res.status(200).json(response)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = emailController
