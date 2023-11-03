const crypto = require('crypto')

const cryptoHelper = {
  encrypt: (text) => {
    const secretKey = Buffer.from(process.env.CRYPO_SECRET_KEY, 'hex')

    // 先產生隨機碼(bytes)
    const iv = Buffer.from(process.env.CRYPO_SECRET_IV, 'hex')
    // secret key hex -> bytes後和iv一起產生加密器
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv)
    // 用update加密
    let encrypted = cipher.update(text, 'utf8')
    // 完成加密的方法：和cipher.final()的bytes加在一起，可以補字元
    encrypted = Buffer.concat([encrypted, cipher.final()])

    // iv和encrypted用:分開, 轉成hex(也可以在update的時候多加hex, 但final也要加hex)
    return iv.toString('hex') + ':' + encrypted.toString('hex')
  },
  decrypt: (text) => {
    const secretKey = Buffer.from(process.env.CRYPO_SECRET_KEY, 'hex')

    const textParts = text.split(':') // 小心可會有多個: 所以除去iv後要再join

    // 拆出iv
    const iv = Buffer.from(textParts.shift(), 'hex')
    // 把iv以外的合回text
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')

    // 產生解密器
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv)
    // 解密
    let decrypted = decipher.update(encryptedText)
    // 最後一步
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  }
}

module.exports = cryptoHelper
