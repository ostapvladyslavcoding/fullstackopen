import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm.jsx'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login.js'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState({ message: null })

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const infoMessage = (message, type = 'info') => {
    setInfo({
      message,
      type,
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 5000)
  }

  const Notification = ({ info }) => {
    if (!info.message) {
      return
    }

    return <div className={info.type}>{info.message}</div>
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBloglistappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      infoMessage(`Logged in as "${user.name}"`)
    } catch (error) {
      infoMessage(error.response.data.error, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    infoMessage('Logged out')
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))

      infoMessage(`Added "${blogObject.title}" by "${blogObject.author}"!`)
    } catch (error) {
      infoMessage(error.response.data.error, 'error')
    }
  }

  const updateLikes = async (id, updatedBlog) => {
    try {
      const res = await blogService.update(id, updatedBlog)

      setBlogs(blogs.map((blog) => (blog.id === res.id ? res : blog)))
      infoMessage(`Liked "${res.title}"!`)
    } catch (error) {
      console.error(error)
      infoMessage(error.response.data.error, 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification info={info} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
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
      <Notification info={info} />
      <div style={{ display: 'inline' }}>{user.name} logged in</div>
      <button onClick={handleLogout}>logout</button>

      <Togglable
        buttonLabel='new blog'
        ref={blogFormRef}
      >
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <h2>Blogs</h2>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateLikes={updateLikes}
          />
        ))}
    </div>
  )
}

export default App
