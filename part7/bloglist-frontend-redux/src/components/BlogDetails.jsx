import { Button, Link, Paper, TextField } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import SendIcon from '@mui/icons-material/Send'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
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
      <Paper
        elevation={1}
        sx={{ padding: '15px', marginTop: '15px' }}
      >
        <h2>
          {blog.title} {blog.author}
        </h2>

        <p>
          <Link
            href='#'
            color='inherit'
            variant='body2'
            underline='always'
          >
            {blog.url}
          </Link>
        </p>
        <p>
          {blog.likes} likes
          <Button
            variant='contained'
            color='secondary'
            size='small'
            onClick={() => updateLikes(blog)}
            endIcon={<ThumbUpIcon />}
          >
            like
          </Button>
        </p>
        <p>added by {blog.user.name}</p>
        {blog.user.username === currentUser && (
          <Button
            variant='contained'
            color='error'
            onClick={() => deleteBlog(blog)}
          >
            delete
          </Button>
        )}

        <Paper
          elevation={3}
          sx={{ padding: '10px' }}
        >
          <h3>Comments</h3>

          <form onSubmit={addComment}>
            <TextField
              name='addComment'
              label='add comment'
              size='small'
            />
            <Button
              type='submit'
              variant='contained'
              size='large'
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </form>

          <div>
            {blog.comments.map((comment, index) => (
              <Paper
                key={index}
                sx={{ padding: '10px', margin: '5px' }}
              >
                <p>{comment}</p>
              </Paper>
            ))}
          </div>
        </Paper>
      </Paper>
    </>
  )
}

export default BlogDetails
