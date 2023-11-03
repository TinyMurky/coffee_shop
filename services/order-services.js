const { Product, Variant, Sale, Order, OrderItem } = require('../models')
const { getCartDiscountPrice } = require('../helpers/discount-helpers')

const orderServices = {
  createOrder: async (email, orderItems, shippingPrice) => {
    // 创建订单
    const order = await Order.create({ email })

    // 创建订单项
    await OrderItem.bulkCreate(orderItems.map((orderItem) => ({
      productId: orderItem.productId,
      variantId: orderItem.variantId,
      quantity: orderItem.quantity,
      orderId: order.id
    })))

    // 获取订单项及关联的产品和销售信息
    const createdOrder = await OrderItem.findAll({
      where: { orderId: order.id },
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

    // 计算订单详情及总价
    const responseData = {
      shippingPrice,
      totalPrice: shippingPrice,
      orderDetails: []
    }

    for (const item of createdOrder) {
      const discountedPrice = await getCartDiscountPrice(item)
      const subTotal = discountedPrice * item.quantity
      responseData.totalPrice += subTotal

      responseData.orderDetails.push({
        productId: item.productId,
        productName: item.Product.name,
        productDescription: item.Product.description,
        productVariant: item.Variant.variantName,
        productQuantity: item.quantity,
        productPrice: item.Variant.variantPrice,
        discountedPrice,
        subTotal,
        createdTime: item.createdAt
      })
    }
    console.log('Totalprice', responseData.totalPrice)
    console.log('shipppingprice', shippingPrice)

    // 更新订单总价
    order.totalPrice = responseData.totalPrice
    await order.save({ fields: ['totalPrice'] })

    return responseData
  },
  removeOrder: async (orderId) => {
    const order = await Order.findByPk(orderId)
    const orderItems = await OrderItem.findAll({ where: { orderId: order.id } })
    console.log(orderItems)
    for (const orderItem of orderItems) {
      await orderItem.destroy()
    }
    await order.destroy()
  },
  getAllOrders: async (email) => {
    // 获取与用户关联的订单
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

    // 处理订单数据
    let subTotal = 0
    const response = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await Promise.all(order.OrderItems.map(async (item) => {
          const discountedPrice = await getCartDiscountPrice(item)
          subTotal += discountedPrice * item.quantity

          return {
            productId: item.productId,
            productName: item.Product.name,
            productDescription: item.Product.description,
            productVariant: item.Variant.variantName,
            productPrice: item.Variant.variantPrice,
            productQuantity: item.quantity,
            createdTime: item.createdAt,
            discountedPrice,
            subTotal
          }
        }))

        return {
          orderId: order.id,
          orderShippingPrice: order.totalPrice - subTotal,
          orderTotalPrice: order.totalPrice,
          orderItems
        }
      })
    )

    return response
  }

}

module.exports = orderServices
