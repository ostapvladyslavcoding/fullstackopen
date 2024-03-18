import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import BlogDetails from './components/BlogDetails.jsx'
import BlogList from './components/BlogList.jsx'
import LoginForm from './components/LoginForm.jsx'
import Notification from './components/Notification'
import UserDetails from './components/UserDetails.jsx'
import UserList from './components/UserList.jsx'
import { clearUser, getUser } from './reducers/loginReducer.js'

const App = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(clearUser())
  }

  if (user === null) {
    return <LoginForm />
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
          element={<BlogList />}
        />
        <Route
          path='/blogs'
          element={<BlogList />}
        />
        <Route
          path='/users'
          element={<UserList />}
        />
        <Route
          path='/users/:id'
          element={<UserDetails />}
        />
        <Route
          path='/blogs/:id'
          element={<BlogDetails currentUser={user.username} />}
        />
      </Routes>
    </div>
  )
}

export default App
