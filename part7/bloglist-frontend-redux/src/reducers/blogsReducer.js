import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    set(state, action) {
      return action.payload
    },
    append(state, action) {
      state.push(action.payload)
    },
    update(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    remove(state, action) {
      const deletedBlog = action.payload
      return state.filter((blog) => blog.id !== deletedBlog.id)
    },
  },
})

export const { set, append, update, remove } = blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll()
      dispatch(set(blogs))
    } catch (error) {
      console.error(error)
    }
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch(append(newBlog))
      dispatch(
        setNotification(
          `Added new blog "${blog.title}" by "${blog.author}"!`,
          'info',
          5
        )
      )
    } catch (error) {
      dispatch(setNotification(`${error.response.data.error}`, 'error', 5))
    }
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
      dispatch(update(updatedBlog))
      dispatch(
        setNotification(
          `Liked "${updatedBlog.title}" by "${updatedBlog.author}"!`,
          'info',
          5
        )
      )
    } catch (error) {
      dispatch(setNotification(`${error.response.data.error}`, 'error', 5))
    }
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    try {
      const deletedBlog = await blogService.remove(id)
      dispatch(remove(deletedBlog))
      dispatch(
        setNotification(
          `Deleted blog "${deletedBlog.title}" by "${deletedBlog.author}"!`,
          'info',
          5
        )
      )
    } catch (error) {
      console.log('HALLO')
      dispatch(setNotification(`${error.response.data.error}`, 'error', 5))
    }
  }
}

export default blogsSlice.reducer
