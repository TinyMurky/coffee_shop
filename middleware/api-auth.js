const passport = require('../config/passport')
const { AuthorizationError } = require('../libs/error/custom-error')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      throw new AuthorizationError('Unauthorized')
    }
    req.user = user
    next()
  })(req, res, next)
}

module.exports = {
  authenticated
}
