import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { addLike, initializeBlogs, removeBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer.js'

const BlogView = ({ currentUser }) => {
  const id = useParams().id
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((b) => b.id === id)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  if (!blog) {
    return <h2>Blog not found or loading...</h2>
  }

  const handleLikeClick = () => {
    const updatedBlog = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    updateLikes(blog.id, updatedBlog)
  }

  const handleDeleteClick = () => {
    if (window.confirm(`Remove blog "${blog.title}" by "${blog.author}"?`))
      deleteBlog(blog.id)
  }

  const updateLikes = async (id) => {
    try {
      dispatch(addLike(id))
    } catch (error) {
      console.error(error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      dispatch(removeBlog(id))
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
        likes: {blog.likes}
        <button onClick={handleLikeClick}>like</button>
      </p>
      <p>added by {blog.user.name}</p>
      {blog.user.username === currentUser && (
        <button onClick={handleDeleteClick}>delete</button>
      )}
    </>
  )
}

export default BlogView
