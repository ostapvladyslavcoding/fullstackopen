import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOGIN } from '../queries.js'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('test')
  const [password, setPassword] = useState('secret')
  const navigate = useNavigate()

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error.graphQLErrors[0].message)
    },
    onCompleted: (result) => {
      const token = result.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      navigate('/')
    },
  })

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
