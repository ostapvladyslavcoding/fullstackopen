const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const user = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  })
  res.json(user)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!password || password.length < 3) {
    return res.status(400).json({
      error: '`password` is shorter than the minimum allowed length (3)',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })
  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter
