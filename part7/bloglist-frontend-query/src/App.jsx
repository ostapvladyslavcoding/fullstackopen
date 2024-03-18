import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'

import { useNotificationDispatch } from './NotificationContext'
import UserContext from './UserContext'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm.jsx'
import Notification, { setNotification } from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login.js'

const App = () => {
  const dispatch = useNotificationDispatch()
  const [user, dispatchUser] = useContext(UserContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatchUser({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [dispatchUser])

  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (user) => {
      window.localStorage.setItem('loggedBloglistappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatchUser({ type: 'SET_USER', payload: user })
      setNotification(dispatch, `Logged in as "${user.name}"`)
    },
    onError: (error) => {
      console.error(error)
      setNotification(dispatch, error.response.data.error, 'error')
    },
  })

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return <div>blogs service not available due to problems in server</div>
  }
  const blogs = result.data ? result.data : []

  const handleLogin = (e) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatchUser({ type: 'CLEAR_USER' })
    setNotification(dispatch, 'Logged out')
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

      <BlogForm />

      <h2>Blogs</h2>
      <div data-testid='parent'>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
            />
          ))}
      </div>
    </div>
  )
}

export default App
