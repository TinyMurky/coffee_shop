'use strict'

const passport = require('passport')
const bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookTokenStrategy = require('passport-facebook-token')
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

const facebookStrategy = new FacebookTokenStrategy(
  {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'first_name', 'last_name', 'email', 'picture'],
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    process.nextTick(async function () {
      console.log('Facebook authentication triggered')
      try {
        // 檢查 FB 個人資料是否有關聯的電子郵件地址。有時 FB 個人資料可能是由手機號碼建立的，
        // 在這種情況下，FB 可能不會有電子郵件地址 - 如果沒有電子郵件地址，則失敗並顯示相應錯誤訊息
        if (!profile._json.email) {
          return done(null, false,
            { message: 'Facebook 帳戶未註冊電子郵件。請使用其他方式登錄' })
        }

        const user = await User.findOne({ where: { email: profile._json.email } })
        if (user) {
          return done(null, user)
        } else {
          const password = Math.random().toString(36).substring(8)
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(password, salt)
          const newUser = User.build({
            name: `${profile._json.first_name}` + `${profile._json.last_name}`,
            email: profile._json.email,
            password: hash,
            introduction: `Hello, I am ${name}`,
            isAdmin: false,
            avatar: profile._json.picture.data.url,
            hadSubscribed: false
          })
          await newUser.save()
          return done(null, newUser)
        }
      } catch (error) {
        return done(error, false)
      }
    })
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
passport.use(facebookStrategy)
passport.use(googleStrategy)
module.exports = passport
