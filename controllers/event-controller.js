const eventServices = require('../services/event-services')
const eventController = {
  getActiveEvent: async (req, res, next) => {
    try {
      const events = await eventServices.getActiveEvent()
      const response = {
        status: 'success',
        data: events
      }
      return res.status(200).json(response)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = eventController
