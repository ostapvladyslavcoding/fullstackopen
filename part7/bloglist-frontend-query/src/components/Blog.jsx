import { useMutation, useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'
import blogService from '../services/blogs'
import { setNotification } from './Notification'

const Blog = ({ blog, currentUser }) => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (blogs) => {
        return blogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      })
      setNotification(
        dispatch,
        `Liked "${updatedBlog.title}" by "${updatedBlog.author}"!`
      )
    },
    onError: (error) => {
      console.error(error)
      setNotification(dispatch, error.response.data.error, 'error')
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (removedBlog) => {
      queryClient.setQueryData(['blogs'], (blogs) => {
        return blogs.filter((blog) => blog.id !== removedBlog.id)
      })
      setNotification(
        dispatch,
        `Deleted blog "${removedBlog.title}" by "${removedBlog.author}!`
      )
    },
    onError: (error) => {
      console.error(error)
      setNotification(dispatch, error.response.data.error, 'error')
    },
  })

  const [detailsVisible, setDetailsVisible] = useState(false)
  const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLikeClick = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    updateBlogMutation.mutate(updatedBlog)
  }

  const handleDeleteClick = () => {
    if (window.confirm(`Remove blog "${blog.title}" by "${blog.author}"?`))
      deleteBlogMutation.mutate(blog.id)
  }

  return (
    <div
      title='blog'
      style={blogStyle}
    >
      <span>
        {blog.title} {blog.author}
      </span>
      <div style={hideWhenVisible}>
        <button onClick={() => setDetailsVisible(true)}>View</button>
      </div>
      <div
        className='togglableContent'
        style={showWhenVisible}
      >
        <button onClick={() => setDetailsVisible(false)}>Hide</button>
        <p>{blog.url}</p>
        <p>
          likes: {blog.likes}
          <button onClick={() => handleLikeClick(blog)}>like</button>
        </p>
        <p>{blog.user.username}</p>
        {blog.user.username === currentUser && (
          <button onClick={() => handleDeleteClick(blog.id)}>delete</button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  currentUser: PropTypes.string.isRequired,
}

export default Blog
