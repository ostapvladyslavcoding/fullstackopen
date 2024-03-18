import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from '../reducers/usersReducer.js'
import userService from '../services/users.js'

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  if (users === null) {
    return null
  }

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Names</th>
            <th>Number of Blogs</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Users
