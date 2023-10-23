const localStorageHelpers = {
  getCartItemsFromLocalStorage: () => {
  // 从本地存储获取购物车项目数据
    const cartItemsJSON = localStorage.getItem('cartItems')

    // 如果本地存储中没有购物车项目数据，返回一个空陣列
    if (!cartItemsJSON) {
      return []
    }
  }
}

module.exports = localStorageHelpers
