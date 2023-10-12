const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

let authHeader

describe('blogs api', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user = helper.initialUsers[0]
    await api.post('/api/users').send(user)
    const res = await api.post('/api/login').send(user)
    authHeader = `Bearer ${res.body.token}`
  })

  describe('when there is initially some blogs saved', () => {
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

    test('all blogs are returned', async () => {
      const res = await api.get('/api/blogs')

      expect(res.body).toHaveLength(helper.initialBlogs.length)
    })

    test('unique identifier is called "id" and not "_id"', async () => {
      const res = await api.get('/api/blogs')

      expect(res.body[0].id).toBeDefined()
      expect(res.body[0]._id).not.toBeDefined()
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
          .set('Authorization', authHeader)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map((b) => b.title)
        expect(titles).toContain(newBlog.title)
      })

      test('when likes are missing from blog, it will default to value 0', async () => {
        const newBlog = {
          title: 'newTitle',
          author: 'newAuthor',
          url: 'newUrl',
        }

        const savedBlog = await api
          .post('/api/blogs')
          .set('Authorization', authHeader)
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

        await api
          .post('/api/blogs')
          .set('Authorization', authHeader)
          .send(newBlog)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      })

      test('fails with status 401 when token is not provided', async () => {
        const newBlog = {
          author: 'newAuthor',
          likes: 5,
        }

        await api.post('/api/blogs').send(newBlog).expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      })
    })

    describe('deletion of a blog', () => {
      let id
      beforeEach(async () => {
        await Blog.deleteMany({})

        const blog = helper.initialBlogs[0]

        const response = await api
          .post('/api/blogs')
          .set('Authorization', authHeader)
          .send(blog)

        id = response.body.id
      })

      test('succeeds with status 204 if id is valid', async () => {
        await api
          .delete(`/api/blogs/${id}`)
          .set('Authorization', authHeader)
          .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(0)
      })

      test('succeeds with status 204 if id is invalid', async () => {
        const idToDelete = await helper.nonExistingId()

        await api
          .delete(`/api/blogs/${idToDelete}`)
          .set('Authorization', authHeader)
          .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(1)
      })

      test('fails with status 401 if token is not provided', async () => {
        await api.delete(`/api/blogs/${id}`).expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(1)
      })
    })

    describe('update of a blog', () => {
      let id
      let blog

      beforeEach(async () => {
        await Blog.deleteMany({})

        blog = helper.initialBlogs[0]

        const response = await api
          .post('/api/blogs')
          .set('Authorization', authHeader)
          .send(blog)

        id = response.body.id
      })

      test('succeeds with status 200 with valid id', async () => {
        const editedBlog = {
          ...blog,
          author: 'updatedAuthor',
          likes: 1,
        }

        await api
          .put(`/api/blogs/${id}`)
          .set('Authorization', authHeader)
          .send(editedBlog)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        const authors = blogsAtEnd.map((b) => b.author)
        expect(authors).toContain(editedBlog.author)
      })

      test('fails with status 400 with invalid id', async () => {
        const nonExistingId = await helper.nonExistingId()

        const editedBlog = {
          ...blog,
          author: 'updatedAuthor',
          likes: 1,
        }

        await api
          .put(`/api/blogs/${nonExistingId}`)
          .set('Authorization', authHeader)
          .send(editedBlog)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        const authors = blogsAtEnd.map((b) => b.author)
        expect(authors).not.toContain(editedBlog.author)
      })

      test('fails with status 400 with invalid data', async () => {
        const editedBlog = {
          ...blog,
          likes: 'ads',
        }

        await api
          .put(`/api/blogs/${id}`)
          .set('Authorization', authHeader)
          .send(editedBlog)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        const likes = blogsAtEnd.map((b) => b.likes)
        expect(likes).not.toContain(editedBlog.likes)
      })

      test('fails with status 401 if token is not provided', async () => {
        const editedBlog = {
          ...blog,
          likes: 5,
        }

        await api.put(`/api/blogs/${id}`).send(editedBlog).expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        const likes = blogsAtEnd.map((b) => b.likes)
        expect(likes).not.toContain(editedBlog.likes)
      })
    })
  })

  describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('superuser', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'test',
        name: 'Test Test',
        password: 'test',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails if username not unique', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'superuser',
        password: 'superuser',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('expected `username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if username is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'superuser',
        password: 'superuser',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain(
        'User validation failed: username: Path `username` is required.'
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if username is less than minimum allowed length', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ro',
        name: 'superuser',
        password: 'superuser',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain(
        'User validation failed: username: Path `username` (`ro`) is shorter than the minimum allowed length (3).'
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if password is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'superuser',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain(
        '`password` is shorter than the minimum allowed length (3)'
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if password length is less than minimum allowed', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'superuser',
        password: 'su',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain(
        '`password` is shorter than the minimum allowed length (3)'
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
