'use strict'

const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
// const FacebookStrategy = require('passport-facebook').Strategy
const FacebookTokenStrategy = require('passport-facebook-token')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

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
passport.use(facebookStrategy)
module.exports = passport

// ex 1
// const facebookStrategy = new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: process.env.BASE_SERVER_URL + '/api/facebook/callback',
//   profileFields: ['id', 'first_name', 'last_name', 'email', 'picture'],
//   passReqToCallback: true
// },
// function (req, accessToken, refreshToken, profile, done) {
//   process.nextTick(async function () {
//     console.log('Facebook authentication triggered')
//     try {
//       // Check if the fb profile has an email associated. Sometimes FB profiles can be created by phone
//       // numbers in which case FB doesn't have an email - If email is not present, we fail the signup
//       // with the proper error message
//       if (!profile._json.email) {
//         return done(null, false,
//           { message: 'Facebook Account is not registered with email. Please sign in using other methods' })
//       }
//       const data = await utils.getOrCreateNewUserWithMedium(
//         accessToken,
//         profile.id,
//         profile._json.first_name,
//         profile._json.last_name,
//         profile._json.picture.data.url,
//         profile._json.email,
//         'facebook',
//         parseInt(req.query.state)) // An optional param you can pass to the request
//       if (data.alreadyRegisteredError) {
//         // You can also support logging the user in and overriding the login medium
//         done(null, false, {
//           message: `Email is alredy registered with ${data.medium} account. Please login with email.`
//         })
//       } else {
//         done(null, { id: data.id, email: data.email, firstName: data.firstName, lastName: data.lastName })
//       }
//     } catch (err) {
//       return done(null, null, { message: 'Unknown error' })
//     }
//   })
// }
// )
// ex 2
// module.exports = function (passport) {
//   passport.use(
//     'facebook-token',
//     new FacebookTokenStrategy(
//       {
//         clientID: process.env.FACEBOOK_ID,
//         clientSecret: process.env.FACEBOOK_SECRET
//       },
//       (token, refreshToken, profile, done) => {
//         // console.log(token);
//         process.nextTick(function () {
//           user.facebook.token = token
//           user.facebook.name =
//             profile.name.givenName + ' ' + profile.name.familyName
//           user.facebook.email = profile.emails[0].value
//           user.updated_dt = Date.now()
//           console.log(user)
//           return done(null, user)
//         })
//       }
//     )
//   )
// }
