const { Sale, Product } = require('../models')
const activatedHelpers = require('../helpers/event-sale-activated-helper')

const saleServices = {
  getActiveSale: async () => {
    // Sequelize.fn('DATE(SQL語法)', 要算哪個欄位), 欄位別名)
    // 因為時間儲存是DATETIME2023-10-01 00:00:00，會讓最後一天在凌晨之後會無效
    // 所以我們要
    const today = new Date()

    const sales = await Sale.findAll({
      // raw: true,
      // nest: true,
      require: true,
      include: [
        {
          model: Product,
          as: 'effectedProductsOfSale',
          required: true,
          attributes: ['id', 'name'],
          through: {
            attributes: [] // 讓ProductSale的內如不要回傳污染
          }
        }
      ],
      where: {
        ...activatedHelpers.getFullYearCondition(today)
      }
    })

    return sales
  }
}

module.exports = saleServices
