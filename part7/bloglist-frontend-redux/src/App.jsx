import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm.jsx'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import {
  addLike,
  createBlog,
  initializeBlogs,
  removeBlog,
} from './reducers/blogsReducer.js'
import { clearUser, getUser, setUser } from './reducers/userReducer.js'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      dispatch(setUser(username, password))
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = () => {
    dispatch(clearUser())
  }

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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid='username'
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid='password'
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div style={{ display: 'inline' }}>{user.name} logged in</div>
      <button onClick={handleLogout}>logout</button>

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
    </div>
  )
}

export default App
