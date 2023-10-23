const { NotFoundError } = require('../libs/error/custom-error')
const { CartItem, Cart, Product, Variant, Sale } = require('../models')
const { getCartDiscountPrice } = require('../helpers/discount-helpers')
// const { getCartItemsFromLocalStorage } = require('../helpers/local-storage-helpers')

const cartServices = {
  getCartItems: async (req, cb) => {
    try {
      const userId = req.user.id

      // 从本地存储获取购物车项目，如果没有则为空陣列
      const localCartItems = req.body.cartItems

      // 获取用户的数据库购物车
      const cart = await Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            include: [
              {
                model: Product,
                include: {
                  model: Sale,
                  as: 'salesOfProduct'
                }
              },
              {
                model: Variant
              }
            ]
          }
        ]
      })

      if (!cart) {
        throw new NotFoundError('该用户目前没有购物车')
      }

      // 如果本地存储中有购物车项目，将它们与数据库购物车项目进行比较
      if (localCartItems.length > 0) {
        for (const localCartItem of localCartItems) {
          // 查找数据库购物车项目是否具有相同的产品和变体
          const existingCartItem = cart.CartItems.find(
            (item) =>
              item.productId === localCartItem.productId &&
              item.Variant.variantName === localCartItem.productVariant
          )

          if (existingCartItem) {
            // 如果找到匹配项，增加数量
            existingCartItem.quantity += localCartItem.productQuantity
            await existingCartItem.save()
          } else {
            // 如果没有匹配项，创建一个新的购物车项目
            await CartItem.create({
              cartId: cart.id,
              productId: localCartItem.productId,
              variantId: localCartItem.variantId,
              quantity: localCartItem.productQuantity
            })
          }
        }
      }

      // 获取购物车项目的信息
      const cartItems = await Promise.all(
        cart.CartItems.map(async (item) => {
          const discountedPrice = await getCartDiscountPrice(item)
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
      )

      // 返回购物车项目
      cb(null, cartItems)
    } catch (err) {
      cb(err)
    }
  },

  modifyCartItem: async (req, cb) => {
    try {
      const userId = req.user.id
      const productId = req.params.id
      const { quantity, variantName } = req.body
      const cart = await Cart.findOrCreate({ where: { userId } })
      const variant = await Variant.findOne({ where: { variantName, productId } })

      if (!quantity || !variantName) {
        throw new NotFoundError('商品的數量和規格未提供')
      }

      if (!variant) {
        throw new NotFoundError('此商品不存在')
      }

      // 尝试查找具有相同 productId 和 variantId 的 cartItem
      const existingCartItem = await CartItem.findOne({
        where: {
          cartId: cart[0].id,
          productId,
          variantId: variant.id
        }
      })

      if (existingCartItem) {
        // 如果已经存在相同的 cartItem，更新它的 quantity
        existingCartItem.quantity += quantity

        await existingCartItem.save()

        const response = {
          message: `成功修改購物車的商品加${quantity}件, 現在總共有${existingCartItem.quantity}件`,
          cartItemId: existingCartItem.id // 返回 cartItemId

        }

        cb(null, response)
      } else {
        // 如果不存在相同的 cartItem，创建一个新的 cartItem
        const newCartItem = await CartItem.create({
          cartId: cart[0].id,
          productId,
          variantId: variant.id,
          quantity
        })

        const response = {
          message: `成功將 ${quantity} 件商品添加到購物車`,
          cartItemId: newCartItem.id // 返回 cartItemId
        }

        cb(null, response)
      }
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
      cb(null, { message: `已删除購物車項目${cartItemId}` })
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

    const discountedPrice = await getCartDiscountPrice(cartItem)
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
