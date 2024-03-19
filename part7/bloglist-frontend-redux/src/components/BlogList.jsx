import { List, ListItem, Paper } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearDetails } from '../reducers/blogDetailsReducer'
import { createBlog, initializeBlogs } from '../reducers/blogsReducer'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(clearDetails())
  }, [dispatch])

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))
    } catch (error) {
      console.error(error)
    }
  }

  const Blog = ({ blog }) => {
    return (
      <div title='blog'>
        <List>
          <ListItem
            divider
            disableGutters
          >
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </ListItem>
        </List>
      </div>
    )
  }

  return (
    <>
      <h2>Blogs</h2>
      <Togglable
        buttonLabel='new blog'
        ref={blogFormRef}
      >
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <Paper sx={{ padding: '10px', marginTop: '10px' }}>
        <div data-testid='parent'>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
              />
            ))}
        </div>
      </Paper>
    </>
  )
}

export default BlogList
