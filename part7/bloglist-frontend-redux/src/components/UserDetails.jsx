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

export default UserDetails
