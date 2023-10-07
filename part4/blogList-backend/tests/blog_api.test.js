const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')

    expect(res.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier is called "id" and not "_id"', async () => {
    const res = await api.get('/api/blogs')

    expect(res.body[0].id).toBeDefined()
    expect(res.body[0]._id).not.toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('succeeds with status 201', async () => {
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

  test('fails with status 400 when title or url is missing', async () => {
    const newBlog = {
      author: 'newAuthor',
      likes: 5,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((b) => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('succeeds with status 204 if id is invalid', async () => {
    const idToDelete = await helper.nonExistingId()

    await api.delete(`/api/blogs/${idToDelete}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
