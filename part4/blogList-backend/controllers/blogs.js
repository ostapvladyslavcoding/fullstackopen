const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes, userId } = req.body

  // const user = await User.findById(userId)
  let user = await User.findById(userId)
  if (!user) {
    user = await User.find({})
    user = user[0]
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { title, url, author, likes } = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, url, author, likes },
    { new: true }
  )

  if (updatedBlog) {
    res.json(updatedBlog)
  } else {
    res.status(400).end()
  }
})

module.exports = blogsRouter
