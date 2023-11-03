const saleServices = require('../services/sale-services')
const saleController = {
  getActiveSale: async (req, res, next) => {
    try {
      const sales = await saleServices.getActiveSale()
      const response = {
        status: 'success',
        data: sales
      }
      return res.status(200).json(response)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = saleController
