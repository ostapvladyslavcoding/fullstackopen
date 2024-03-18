import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addLike,
  createBlog,
  initializeBlogs,
  removeBlog,
} from '../reducers/blogsReducer'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))
    } catch (error) {
      console.error(error)
    }
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
      <Togglable
        buttonLabel='new blog'
        ref={blogFormRef}
      >
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <h2>Blogs</h2>
      <div data-testid='parent'>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateLikes={updateLikes}
              deleteBlog={deleteBlog}
              currentUser={user.username}
            />
          ))}
      </div>
    </>
  )
}

export default Blogs
