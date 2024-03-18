import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import BlogView from './components/BlogView.jsx'
import Blogs from './components/Blogs.jsx'
import Notification from './components/Notification'
import User from './components/User.jsx'
import Users from './components/Users.jsx'
import { clearUser, getUser, setUser } from './reducers/loginReducer.js'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(setUser(username, password))
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    dispatch(clearUser())
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

      <Routes>
        <Route
          path='/'
          element={<Blogs />}
        />
        <Route
          path='/blogs'
          element={<Blogs />}
        />
        <Route
          path='/users'
          element={<Users />}
        />
        <Route
          path='/users/:id'
          element={<User />}
        />
        <Route
          path='/blogs/:id'
          element={<BlogView currentUser={user.username} />}
        />
      </Routes>
    </div>
  )
}

export default App
