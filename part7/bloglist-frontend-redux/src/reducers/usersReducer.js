import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import userService from '../services/users'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'users',
  initialState: null,
  reducers: {
    set(state, action) {
      return action.payload
    },
    clear(state, action) {
      return null
    },
  },
})

export const getUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(set(user))
    }
  }
}

export const clearUser = () => {
  return (dispatch) => {
    window.localStorage.clear()
    dispatch(clear())
    dispatch(setNotification('Logged out', 'info', 5))
  }
}

export const initializeUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll()
      dispatch(set(users))
    } catch (error) {
      console.error(error)
      dispatch(setNotification('Error initializing users', 'error', 5))
    }
  }
}

export const { set, get, clear } = userSlice.actions
export default userSlice.reducer
