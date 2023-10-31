const { Product, Variant, Sale, Order, OrderItem } = require('../models')
const { getCartDiscountPrice } = require('../helpers/discount-helpers')

const orderServices = {
  createOrder: async (email, orderItems) => {
    const order = await Order.create({ email })

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
    const orderItems = await OrderItem.findAll({ orderId: order.id })
    await Promise.all(orderItems.map(async (orderItem) => {
      await orderItem.destroy()
    }))
    await order.destroy()
  },
  getAllOrders: async (email) => {
    const orders = await Order.findAll({
      where: { email },
      include: [
        {
          model: OrderItem,
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
    const response = await Promise.all(
      orders.map(async (order) => {
        console.log('order', order)
        const orderItemsData = await Promise.all(
          order.OrderItems.map(async (item) => {
            console.log('item', item)
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
        console.log('orderItemsData', orderItemsData)
        return orderItemsData
      })
    )
    // 由于上述代码会返回嵌套数组，使用 flat() 扁平化数组
    console.log('response', response)
    return response.flat()
  }

}

module.exports = orderServices