import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm.jsx'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import {
  addLike,
  createBlog,
  initializeBlogs,
} from './reducers/blogsReducer.js'
import { setNotification } from './reducers/notificationReducer.js'
import blogService from './services/blogs'
import loginService from './services/login.js'

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBloglistappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch(setNotification(`Logged in as "${user.name}"`, 'info', 5))
    } catch (error) {
      console.error(error)
      dispatch(setNotification(`${error.response.data.error}`, 'error', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    dispatch(setNotification('Logged out', 'info', 5))
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))

      dispatch(
        setNotification(
          `Added "${blogObject.title}" by "${blogObject.author}"!`,
          'info',
          5
        )
      )
    } catch (error) {
      console.error(error)
      dispatch(setNotification(`${error.response.data.error}`, 'error', 5))
    }
  }

  const updateLikes = async (id, updatedBlog) => {
    try {
      const res = await blogService.update(id, updatedBlog)

      setBlogs(blogs.map((blog) => (blog.id === res.id ? res : blog)))
      dispatch(setNotification(`Liked "${res.title}"!`, 'info', 5))
    } catch (error) {
      console.error(error)
      dispatch(setNotification(`${error.response.data.error}`, 'error', 5))
    }
  }

  const deleteBlog = async (id) => {
    try {
      const deletedBlog = blogs.find(
        (blog) => id.toString() === blog.id.toString()
      )
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => id.toString() !== blog.id.toString()))
      dispatch(
        setNotification(
          `Deleted blog "${deletedBlog.title}" by "${deletedBlog.author}"!`,
          'info',
          5
        )
      )
    } catch (error) {
      console.error(error)
      dispatch(setNotification(`${error.response.data.error}`, 'error', 5))
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid='username'
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid='password'
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div style={{ display: 'inline' }}>{user.name} logged in</div>
      <button onClick={handleLogout}>logout</button>

      <Togglable
        buttonLabel='new blog'
        ref={blogFormRef}
      >
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <h2>Blogs</h2>
      <div data-testid='parent'>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateLikes={updateLikes}
              deleteBlog={deleteBlog}
              currentUser={user.username}
            />
          ))}
      </div>
    </div>
  )
}

export default App
