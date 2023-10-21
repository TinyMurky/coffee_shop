const { NotFoundError } = require('../libs/error/custom-error')
const { CartItem, Cart, Product, Variant, Sale } = require('../models')
const { getDiscountePrice } = require('../helpers/cart-helpers')
const cartServices = {
  getCartItems: async (req, cb) => {
    try {
      const userId = req.user.id
      const cart = await Cart.findOne({
        where: { userId },
        require: true,
        include: [
          {
            model: CartItem,
            require: true,
            include: [
              {
                model: Product,
                require: true,
                include: {
                  model: Sale,
                  require: true,
                  as: 'salesOfProduct'
                }
              },
              {
                model: Variant,
                require: true
              }
            ]
          }
        ]
      })
      if (!cart) throw new NotFoundError('該使用者目前沒有購物車')
      if (!cart.CartItems || cart.CartItems.length === 0) { throw new NotFoundError('目前沒有任何商品在購物車！') }

      const cartItems = cart.CartItems.map(item => {
        const discountedPrice = getDiscountePrice(item)
        return {
          productId: item.productId,
          productName: item.Product.name,
          productDescription: item.Product.description,
          productVariant: item.Variant.variantName,
          productPrice: item.Variant.variantPrice,
          productQuantity: item.quantity,
          createdTime: item.createdAt,
          discountedPrice
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

      // console.log(quantity, productId, cart[0].id, variant.id)
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
  },
  getCartItem: async (id) => {
    const cartItem = await CartItem.findByPk(id, {
      require: true,
      include: [
        {
          model: Product,
          require: true,
          include: {
            model: Sale,
            require: true,
            as: 'salesOfProduct'
          }
        },
        {
          model: Variant,
          require: true
        }
      ]
    })

    const discountedPrice = getDiscountePrice(cartItem)
    const { Product: product, Variant: variant, ...rest } = cartItem.toJSON()
    const response = {
      ...rest,
      productName: product.name,
      variantName: variant.variantName,
      variantPrice: variant.variantPrice,
      discountedPrice
    }
    return response
  }

}

module.exports = cartServices
