import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
  },
})

export const { setBlogs, appendBlog, updateBlog } = blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch(appendBlog(newBlog))
  }
}

export const addLike = (id) => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const blogToChange = state.blogs.find((b) => {
        return b.id === id
      })
      const changedBlog = {
        ...blogToChange,
        user: blogToChange.user.id,
        likes: blogToChange.likes + 1,
      }

      const updatedBlog = await blogService.update(id, changedBlog)
      dispatch(updateBlog(updatedBlog))
    } catch (error) {
      console.error(error)
    }
  }
}

export default blogsSlice.reducer
