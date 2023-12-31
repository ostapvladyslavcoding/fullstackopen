const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body

  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'operation not permitted' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    res.status(204).end()
  }

  const user = req.user

  if (!user || blog.user.toString() !== user.id.toString()) {
    return res.status(401).json({ error: 'operation not permitted' })
  }

  user.blogs = user.blogs.filter((b) => b.toString() !== blog.id.toString())

  await user.save()
  await blog.deleteOne()

  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { title, url, author, likes } = req.body

  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(400).json({ error: 'blog not found' })
  }

  const user = req.user

  if (!user || blog.user.toString() !== user.id.toString()) {
    return res.status(401).json({ error: 'operation not permitted' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, url, author, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  res.json(updatedBlog)
})

module.exports = blogsRouter
