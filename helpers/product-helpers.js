const { Product } = require('../models')

const productHelpers = {
  chooseProductsAttriubites: (isCoffee = true) => {
    // Specify attributes based on isCoffee
    const rawAttributes = Object.keys(Product.rawAttributes)

    // 如果不是coffee就把風味拿掉
    const flavor = ['roast', 'aroma', 'sour', 'bitter', 'thickness']

    const attributes = isCoffee
      ? rawAttributes
      : rawAttributes.filter(rawAttribute => !flavor.includes(rawAttribute))

    return attributes
  }
}

module.exports = productHelpers
