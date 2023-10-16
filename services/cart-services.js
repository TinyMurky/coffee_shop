const { NotFoundError } = require('../libs/error/custom-error')
const { CartItem, Cart, User, Product, Variant } = require('../models')
const cartServices = {
  getCartItems: async (req, cb) => {
    try {
      const userId = 3
      const cart = await Cart.findOne({ where: { userId } })
      let cartItems = await CartItem.findAll({ where: { cartId: cart.id }, include: [Product, Variant] })
      if (!cart) throw new NotFoundError('該使用者目前沒有購物車')
      if (!cartItems) throw new NotFoundError('目前沒有任何商品在購物車！')
      cartItems = await cartItems.map(item => {
        return {
          productId: item.productId,
          productName: item.Product.name,
          productDescription: item.Product.description,
          productVariant: item.Variant.variantName,
          productPrice: item.Variant.variantPrice,
          productQuantity: item.quantity,
          createdTime: item.createdAt
        }
      })
      console.log(cart)
      console.log(cartItems)
      cb(null, cartItems)
    } catch (err) {
      cb(err)
    }
  },
  addCartItem: async (req, cb) => {
    try {
      const userId = 3
      const productId = req.params.id
      const { quantity, variantName } = req.body
      const cart = await Cart.findOrCreate({ where: { userId } })
      const variant = await Variant.findOne({ where: { variantName, productId } })

      if (!quantity || !variantName) throw new NotFoundError('商品的數量和規格未提供')
      if (!variant) throw new NotFoundError('此商品不存在')

      console.log(quantity, productId, cart[0].id, variant.id)
      const cartItem = await CartItem.create({ cartId: cart[0].id, productId, variantId: variant.id, quantity })

      console.log(cartItem)
      cb(null, cartItem)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = cartServices
