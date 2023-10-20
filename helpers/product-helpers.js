const { Product } = require('../models')

const productHelpers = {
  chooseProductsAttriubites: (isUtensil = true) => {
    // Specify attributes based on isCoffee
    const rawAttributes = Object.keys(Product.rawAttributes)

    // 如果不是coffee就把風味拿掉
    const flavor = ['roast', 'aroma', 'sour', 'bitter', 'thickness']

    const attributes = isUtensil
      ? rawAttributes.filter(rawAttribute => !flavor.includes(rawAttribute))
      : rawAttributes

    return attributes
  }
}

module.exports = productHelpers
