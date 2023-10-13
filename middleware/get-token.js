const jwt = require('jsonwebtoken')
const getToken = (req, res) => {
  const token = jwt.sign({ user: { email: req.user.email }, id: req.user.id }, process.env.JWT_SECRET)
  res.status(200).json({
    status: 'success',
    data: {
      token,
      userId: req.user.id
    }
  })
}
module.exports = { getToken }
