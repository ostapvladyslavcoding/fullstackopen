const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs are returned', async () => {
  const res = await api.get('/api/blogs')

  expect(res.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identified is called "id" and not "_id"', async () => {
  const res = await api.get('/api/blogs')

  expect(res.body[0].id).toBeDefined()
  expect(res.body[0]._id).not.toBeDefined()
})

test('adding a blog successfully creates new blog', async () => {
  const newBlog = {
    title: 'newTitle',
    author: 'newAuthor',
    url: 'newUrl',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map((b) => b.title)
  expect(titles).toContain('newTitle')
})

test('when likes are missing from blog, it will default to value 0', async () => {
  const newBlog = {
    title: 'newTitle',
    author: 'newAuthor',
    url: 'newUrl',
  }

  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  expect(savedBlog.body.likes).toBe(0)
})

test('when title or url are missing from blog, it will not be saved', async () => {
  const newBlog = {
    author: 'newAuthor',
    likes: 5,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})
