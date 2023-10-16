const pagiHelper = {
  getOffset (limit = null, page = 0) {
    // begin with page 0
    return page * limit
  }
}

module.exports = pagiHelper
