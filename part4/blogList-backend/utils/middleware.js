const logger = require('./logger')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}
