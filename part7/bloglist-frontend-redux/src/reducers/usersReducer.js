import { createSlice } from '@reduxjs/toolkit'
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

export const { set, clear } = userSlice.actions
export default userSlice.reducer
