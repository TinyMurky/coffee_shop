const passport = require('passport')
const bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth20')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const { User } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'Secret'
}
const jwtStrategy = new JWTStrategy(jwtOptions, async function (jwtPayload, cb) {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: []
    })
    if (!user) return cb(null, false)
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err)
  }
})
const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
},
async function (accessToken, refreshToken, profile, done) {
  try {
    const name = profile._json.name
    const email = profile._json.email
    const avatar = profile._json.picture
    const user = await User.findOne({ where: { email } })
    if (user) {
      return done(null, user)
    } else {
      const password = Math.random().toString(36).substring(8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const newUser = User.build({
        name,
        email,
        password: hash,
        introduction: `Hello, I am ${name}`,
        isAdmin: false,
        avatar,
        hadSubscribed: false
      })
      await newUser.save()
      return done(null, newUser)
    }
  } catch (error) {
    return done(error, false)
  }
}
)
passport.use(jwtStrategy)
passport.use(googleStrategy)
module.exports = passport
