import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Routes } from 'react-router-dom'

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
    return (
      <Container>
        <LoginForm />
      </Container>
    )
  }

  const NavBar = () => {
    return (
      <AppBar position='static'>
        <Toolbar>
          <Button
            color='inherit'
            component={Link}
            to='/blogs'
          >
            blogs
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/users'
          >
            users
          </Button>
          {user ? (
            <>
              <Typography
                variant='body1'
                sx={{ marginLeft: 'auto', whiteSpace: 'pre' }}
              >
                {user.username} logged in{' '}
              </Typography>
              <Button
                onClick={handleLogout}
                variant='contained'
                color='secondary'
              >
                logout
              </Button>
            </>
          ) : (
            <Button
              color='inherit'
              component={Link}
              to='/login'
            >
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    )
  }

  return (
    <Container>
      <Notification />
      <NavBar />
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
    </Container>
  )
}

export default App
