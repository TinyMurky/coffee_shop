const { Product, Variant, Sale, Order, OrderItem } = require('../models')
const cryptoHelper = require('../helpers/crypo-helper')
const { getCartDiscountPrice } = require('../helpers/discount-helpers')
const activatedHelpers = require('../helpers/event-sale-activated-helper')
const customError = require('../libs/error/custom-error')
const orderServices = {
  createOrder: async (email, orderItems) => {
    if (!email) {
      throw new customError.CustomError('Email is required!', 'TypeError', 400)
    }
    const encryptEmail = cryptoHelper.encrypt(email)
    const order = await Order.create({ email: encryptEmail })

    for (const orderItem of orderItems) {
      await OrderItem.create({
        productId: orderItem.productId,
        variantId: orderItem.variantId,
        quantity: orderItem.quantity,
        orderId: order.id
      })
    }
    const createdOrder = await OrderItem.findAll({
      where: {
        orderId: order.id
      },
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
    })
    const response = await Promise.all(
      createdOrder.map(async (item) => {
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

    return response
  },
  removeOrder: async (orderId) => {
    const order = await Order.findByPk(orderId)
    const orderItems = await OrderItem.findAll({ where: { orderId: order.id } })
    for (const orderItem of orderItems) {
      await orderItem.destroy()
    }
    await order.destroy()
  },
  getAllOrders: async (email) => {
    const today = new Date()
    const encryptEmail = cryptoHelper.encrypt(email)
    const orders = await Order.findAll({
      where: { email: encryptEmail },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: {

                model: Sale,
                required: false, // 沒有sale的也要找出來所以不可以true
                as: 'salesOfProduct',
                attributes: ['id', 'name', 'discount', 'threshold', 'startTime', 'endTime'],
                where: {
                  ...activatedHelpers.getFullYearCondition(today)
                },
                through: {
                  attributes: []
                }
              }
            },
            {
              model: Variant
            }
          ]
        }
      ]
    })
    // 使用 Promise.all 处理订单和订单项的异步操作
    const response = await Promise.all(orders.map(async (order) => {
      const orderObject = {
        orderId: order.id,
        orderItem: await Promise.all(order.OrderItems.map(async (item) => {
          const discountedPrice = await getCartDiscountPrice(item)
          return {
            productId: item.productId,
            productName: item.Product.name,
            productDescription: item.Product.description,
            productVariant: item.Variant.variantName,
            productPrice: item.Variant.variantPrice,
            productQuantity: item.quantity,
            createdTime: item.createdAt,
            salesOfProduct: item.Product.salesOfProduct,
            discountedPrice
          }
        }))
      }
      return orderObject
    }))

    return response
  }

}

module.exports = orderServices
