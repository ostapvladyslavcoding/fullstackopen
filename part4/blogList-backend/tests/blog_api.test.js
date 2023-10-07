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

afterAll(async () => {
  await mongoose.connection.close()
})
