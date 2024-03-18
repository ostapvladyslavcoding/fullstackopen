import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../services/users.js'

const User = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)

  useEffect(() => {
    userService.getUser(id).then((user) => setUser(user))
  }, [id])

  if (!user) return null

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
