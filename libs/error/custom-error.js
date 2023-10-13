// 驗證錯誤 (Validation Errors)：這些錯誤發生在用戶輸入數據不符合期望格式時。例如，當用戶輸入的電子郵件地址不正確或密碼太短時。
class ValidationError extends Error {
  constructor (message, status = null) {
    super(message)
    this.name = 'ValidationError'
    this.status = status || 400 // 400 Bad Request
  }
}

// 資料庫錯誤 (Database Errors)：這些錯誤發生在資料庫操作期間，例如查詢失敗、插入數據時的重複鍵值等。
class DatabaseError extends Error {
  constructor (message, status = null) {
    super(message)
    this.name = 'DatabaseError'
    this.status = status || 500 // 500 Internal Server Error
  }
}

// 授權錯誤 (Authorization Errors)：當用戶嘗試訪問他們無權訪問的資源時，會發生此類錯誤。
class AuthorizationError extends Error {
  constructor (message, status = null) {
    super(message)
    this.name = 'AuthorizationError'
    this.status = status || 403 // 403 Forbidden
  }
}

// 認證錯誤 (Authentication Errors)：當用戶提供的憑證（例如用戶名和密碼）無效時，會發生此類錯誤。
class AuthenticationError extends Error {
  constructor (message, status = null) {
    super(message)
    this.name = 'AuthenticationError'
    this.status = status || 401 // 401 Unauthorized
  }
}

// 找不到User
class UserNotFoundError extends Error {
  constructor (message, status = null) {
    super(message)
    this.name = 'UserNotFoundError'
    this.status = status || 404 // 404 Not Found
  }
}

// 資源未找到錯誤 (Not Found Errors)：當用戶嘗試訪問不存在的資源時，會發生此類錯誤。
class NotFoundError extends Error {
  constructor (message, status = null) {
    super(message)
    this.name = 'NotFoundError'
    this.status = status || 404 // 404 Not Found
  }
}

// 業務邏輯錯誤 (Business Logic Errors)：這些錯誤發生在應用程序的核心業務邏輯中，例如當庫存不足以完成訂單時。
class BusinessLogicError extends Error {
  constructor (message, status = null) {
    super(message)
    this.name = 'BusinessLogicError'
    this.status = status || 422 // 409 Conflict 或 422 Unprocessable Entity
  }
}

// 服務限制錯誤 (Rate Limiting Errors)：當用戶超出API的請求限制時，會發生此類錯誤。

class RateLimitingErrors extends Error {
  constructor (message, status = null) {
    super(message)
    this.name = 'RateLimitingErrors'
    this.status = status || 429 // 429 Too Many Requests
  }
}

// 第三方服務錯誤 (Third-party Service Errors)：當你的應用程序依賴於第三方服務，並且這些服務出現問題時，捕獲這些錯誤。
class ThirdPartyServiceError extends Error {
  constructor (message, status = null) {
    super(message)
    this.name = 'ThirdPartyServiceError'
    this.status = status || 503 // 502 Bad Gateway 或 503 Service Unavailable
  }
}

// 可以自訂名稱的error
class CustomError extends Error {
  constructor (message, name, status = null) {
    super(message)
    this.name = name
    this.status = status || 500
  }
}

module.exports = {
  ValidationError,
  DatabaseError,
  AuthorizationError,
  AuthenticationError,
  UserNotFoundError,
  NotFoundError,
  BusinessLogicError,
  RateLimitingErrors,
  ThirdPartyServiceError,
  CustomError
}
