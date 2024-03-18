import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import { useNotificationDispatch } from './NotificationContext'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm.jsx'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login.js'

const App = () => {
  const dispatch = useNotificationDispatch()

  const blogFormRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return <div>blogs service not available due to problems in server</div>
  }
  const blogs = result.data ? result.data : []

  const setNotification = (message, type = 'info', timer = 5) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: {
        message,
        type,
      },
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, timer * 1000)
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
      setNotification(`Logged in as "${user.name}"`)
    } catch (error) {
      console.error(error)
      setNotification(error.response.data.error, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    setNotification('Logged out')
  }

  const updateLikes = async (id, updatedBlog) => {
    // try {
    //   const res = await blogService.update(id, updatedBlog)
    //   setBlogs(blogs.map((blog) => (blog.id === res.id ? res : blog)))
    //   setNotification(`Liked "${res.title}" by "${res.author}"!`)
    // } catch (error) {
    //   console.error(error)
    //   setNotification(error.response.data.error, 'error')
    // }
  }

  const deleteBlog = async (id) => {
    // try {
    //   const removedBlog = await blogService.remove(id)
    //   setBlogs(blogs.filter((blog) => id.toString() !== blog.id.toString()))
    //   setNotification(
    //     `Deleted blog "${removedBlog.title}" by "${removedBlog.author}!`
    //   )
    // } catch (error) {
    //   console.error(error)
    //   setNotification(error.response.data.error, 'error')
    // }
  }

  const loginForm = () => (
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

  if (user === null) {
    return loginForm()
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
        <BlogForm />
      </Togglable>

      <h2>Blogs</h2>
      <div data-testid='parent'>
        {blogs
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
