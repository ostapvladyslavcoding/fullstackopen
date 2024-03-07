import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, currentUser }) => {
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

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <div style={hideWhenVisible}>
        <button onClick={() => setDetailsVisible(true)}>View</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={() => setDetailsVisible(false)}>Hide</button>
        <p>{blog.url}</p>
        <p>
          likes: {blog.likes} <button onClick={handleLikeClick}>like</button>
        </p>
        <p>{blog.user.username}</p>
        {blog.user.username === currentUser && (
          <button onClick={handleDeleteClick}>delete</button>
        )}
      </div>
    </div>
  )
}

export default Blog
