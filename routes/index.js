const express = require('express')
const router = express.Router()
const auth = require('./modules/auth') // 引用模組

router.get('/', (req, res) => {
  res.send('<h1>hi</h1>')
})
router.use('/api/user', auth) // 掛載模組

module.exports = router
