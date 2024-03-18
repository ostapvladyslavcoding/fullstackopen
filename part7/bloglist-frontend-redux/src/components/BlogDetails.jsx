import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addLikeDetails,
  addNewComment,
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

  const updateLikes = (blog) => {
    dispatch(addLikeDetails(blog))
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by "${blog.author}"?`)) {
      dispatch(removeBlog(blog.id))
      navigate('/')
    }
  }

  const addComment = (e) => {
    e.preventDefault()
    const comment = e.target.addComment.value
    e.target.addComment.value = ''
    dispatch(addNewComment(blog, comment))
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

      <h3>Comments</h3>

      <form onSubmit={addComment}>
        <input name='addComment' />
        <button>add comment</button>
      </form>

      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </>
  )
}

export default BlogDetails
