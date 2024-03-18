import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setNotification } from '../reducers/notificationReducer.js'
import userService from '../services/users.js'

const User = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    userService
      .getUser(id)
      .then((user) => setUser(user))
      .catch((error) => {
        dispatch(setNotification(error.response.data.error, 'error', 5))
      })
  }, [id, dispatch])

  if (!user) return <h2>User not found or loading...</h2>

  return (
    <>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

export default User
