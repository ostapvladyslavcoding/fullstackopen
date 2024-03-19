import SendIcon from '@mui/icons-material/Send'
import { Button, TextField } from '@mui/material'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label='title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            name='Title'
            required
          />
        </div>
        <div>
          <TextField
            label='author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            name='Author'
          />
        </div>
        <div>
          <TextField
            required
            label='url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            name='Url'
          />
        </div>
        <Button
          type='submit'
          variant='contained'
          endIcon={<SendIcon />}
        >
          create
        </Button>
      </form>
    </>
  )
}

export default BlogForm
