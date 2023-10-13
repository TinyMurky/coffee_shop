function errorHandler (err, req, res, next) {
  // 檢查是否存在status和message屬性，來確定它是否來自 ./custom-error裡定義的error
  if (err.status && err.message) {
    res.status(err.status).json({ status: 'error', message: err.message })
  } else {
    // 如果不是一個自定義錯誤，返回一個通用的500 Internal Server Error
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }

  // 預留，將error拋出去給以後紀錄log使用
  next(err)
}

module.exports = errorHandler
