import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addLikeDetails,
  initializeBlogDetails,
} from '../reducers/blogDetailsReducer.js'
import { removeBlog } from '../reducers/blogsReducer.js'

const BlogDetails = ({ currentUser }) => {
  const id = useParams().id
  const blog = useSelector((state) => state.blogDetails)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(initializeBlogDetails(id))
  }, [id, dispatch])

  if (!blog) {
    return <h2>Blog not found or loading...</h2>
  }

  const updateLikes = async (blog) => {
    try {
      dispatch(addLikeDetails(blog))
    } catch (error) {
      console.error(error)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog "${blog.title}" by "${blog.author}"?`)) {
        dispatch(removeBlog(blog.id))
        navigate('/')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        {blog.likes} likes
        <button onClick={() => updateLikes(blog)}>like</button>
      </p>
      <p>added by {blog.user.name}</p>
      {blog.user.username === currentUser && (
        <button onClick={() => deleteBlog(blog)}>delete</button>
      )}
    </>
  )
}

export default BlogDetails
