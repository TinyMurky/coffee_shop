const { NotFoundError } = require('../libs/error/custom-error')
const { CartItem, Cart, Product, Variant } = require('../models')
const cartServices = {
  getCartItems: async (req, cb) => {
    try {
      const userId = req.user.id
      const cart = await Cart.findOne({ where: { userId } })
      if (!cart) throw new NotFoundError('該使用者目前沒有購物車')
      let cartItems = await CartItem.findAll({ where: { cartId: cart.id }, include: [Product, Variant] })
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
      const userId = req.user.id
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
  },
  removeCartItem: async (req, cb) => {
    try {
      const userId = req.user.id
      const cartItemId = req.params.id
      // 首先，你需要检查用户是否拥有该购物车项
      const cartItem = await CartItem.findOne({
        where: { id: cartItemId },
        include: [
          {
            model: Cart,
            where: { userId }
          }
        ]
      })

      if (!cartItem) {
        throw new NotFoundError('找不到要删除的购物车项')
      }

      // 如果购物车项存在并且属于当前用户，你可以删除它
      await cartItem.destroy()

      // 返回成功消息或其他响应
      cb(null, { message: '已删除一筆購物車項目' })
    } catch (err) {
      cb(err)
    }
  }

}

module.exports = cartServices
