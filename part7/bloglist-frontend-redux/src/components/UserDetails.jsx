import { Paper } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { initializeUserDetails } from '../reducers/userDetailsReducer.js'

const UserDetails = () => {
  const id = useParams().id
  const user = useSelector((state) => state.userDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUserDetails(id))
  }, [id, dispatch])

  if (!user) return <h2>User not found or loading...</h2>

  return (
    <>
      <Paper sx={{ padding: '10px', marginTop: '10px' }}>
        <h2>{user.name}</h2>
        <h3>Added blogs</h3>
        <ul>
          {user.blogs.map((blog) => (
            <li
              style={{ padding: '10px', borderBottom: '1px solid #ccc' }}
              key={blog.id}
            >
              {blog.title}
            </li>
          ))}
        </ul>
      </Paper>
    </>
  )
}

export default UserDetails
