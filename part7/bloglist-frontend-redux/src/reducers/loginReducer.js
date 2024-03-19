import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
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

export const setUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(set(user))
      dispatch(setNotification(`Logged in as "${user.name}"`, 'info', 5))
    } catch (error) {
      console.error(error)
      dispatch(setNotification(`${error.response.data.error}`, 'error', 5))
    }
  }
}

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

export const { set, get, clear } = userSlice.actions
export default userSlice.reducer
