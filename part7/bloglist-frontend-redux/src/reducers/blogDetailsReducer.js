import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogDetailsSlice = createSlice({
  name: 'blogDetails',
  initialState: null,
  reducers: {
    setDetails(state, action) {
      return action.payload
    },
    updateDetails(state, action) {
      return action.payload
    },
    clearDetails(state, action) {
      return null
    },
  },
})

export const initializeBlogDetails = (id) => {
  return async (dispatch) => {
    try {
      const blog = await blogService.getBlog(id)
      dispatch(setDetails(blog))
    } catch (error) {
      console.error(error)
      dispatch(setNotification('Error initializing blog', 'error', 5))
    }
  }
}

export const addLikeDetails = (blog) => {
  return async (dispatch) => {
    try {
      const changedBlog = {
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      }

      const updatedBlog = await blogService.update(changedBlog.id, changedBlog)
      dispatch(updateDetails(updatedBlog))
      dispatch(
        setNotification(
          `Liked "${updatedBlog.title}" by "${updatedBlog.author}"!`,
          'info',
          5
        )
      )
    } catch (error) {
      console.error(error)
      dispatch(setNotification(`${error.response.data.error}`, 'error', 5))
    }
  }
}

export const { setDetails, updateDetails, clearDetails } =
  blogDetailsSlice.actions
export default blogDetailsSlice.reducer
