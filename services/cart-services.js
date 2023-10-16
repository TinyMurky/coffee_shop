const { NotFoundError } = require('../libs/error/custom-error')
const { CartItem, Cart, User, Product, Variant } = require('../models')
const cartServices = {
  getCartItems: async (req, cb) => {
    try {
      const userId = 3
      const cartId = await Cart.findOne({ where: { userId } })
      const cartItems = await CartItem.findAll({ where: { cartId } })
      //   if (!cartId) throw new NotFoundError('該使用者目前沒有購物車')
      //   if (!cartItems) throw new NotFoundError('目前沒有任何商品在購物車！')

      //   cartItems = await cartItems.map(tweet => {
      //     return {
      //       ...tweet.dataValues,
      //       description: subDescription,
      //       createdAt: relativeTimeFromNow(tweet.dataValues.createdAt),
      //       isLiked: !!(tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)),
      //       replyCount: tweet.Replies.length,
      //       likeCount: tweet.Likes.length
      //     }
      //   })
      console.log(cartId)
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
