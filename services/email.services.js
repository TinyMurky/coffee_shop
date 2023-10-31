const nodemailer = require('nodemailer')
const customError = require('../libs/error/custom-error')
const fs = require('fs')

const emailService = {
  sendOrderedEmail: async (userEmail, orderInquireLink) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    // 檢查input格式
    if (!userEmail) {
      throw new customError.CustomError('未提供目標email', 'TypeError', 400)
    }

    if (!(emailRegex.test(userEmail))) {
      throw new customError.ValidationError('Email不符合信箱格式')
    }

    if (!orderInquireLink || typeof orderInquireLink !== 'string') {
      throw new customError.ValidationError('未提供訂單查詢網址')
    }
    // setup email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // for port 465
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.GOOGLE_SMTP_MAIL,
        pass: process.env.GOOGLE_SMTP_PASSWORD
      }
    })

    // 讀入寫好的html, 將order查詢網站寫入<a>
    let emailHtml = fs.readFileSync('./libs/email/email.html', 'utf8')
    emailHtml = emailHtml.replace('{{orderInquireLink}}', orderInquireLink)

    const info = await transporter.sendMail({
      from: process.env.GOOGLE_SMTP_MAIL,
      to: userEmail,
      subject: '您於大岳咖啡的訂單已建立成功！', // Subject line
      text: 'Hello world?',
      html: emailHtml
    })
    return info
  }
}

module.exports = emailService
