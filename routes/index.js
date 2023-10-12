const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('<h1>hi</h1>')
})

module.exports = router