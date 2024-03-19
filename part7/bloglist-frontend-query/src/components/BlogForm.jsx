import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'
import blogService from '../services/blogs'
import { setNotification } from './Notification'
import Togglable from './Togglable'

const BlogForm = () => {
  const blogFormRef = useRef()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      setNotification(
        dispatch,
        `a new blog "${newBlog.title}" by "${newBlog.author}" added`
      )
    },
    onError: (error) => {
      console.error(error)
      setNotification(dispatch, error.response.data.error, 'error')
    },
  })

  const addBlog = (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Togglable
      buttonLabel='new blog'
      ref={blogFormRef}
    >
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid='title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            name='Title'
            placeholder='enter title here'
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            name='Author'
            placeholder='enter author here'
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            name='Url'
            placeholder='enter url here'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </Togglable>
  )
}

export default BlogForm
