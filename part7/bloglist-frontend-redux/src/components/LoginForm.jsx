import { Button, TextField } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/loginReducer'
import Notification from './Notification'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(setUser(username, password))
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification />

      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label='username'
            data-testid='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label='password'
            data-testid='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          <Button
            variant='contained'
            color='primary'
            type='submit'
          >
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
