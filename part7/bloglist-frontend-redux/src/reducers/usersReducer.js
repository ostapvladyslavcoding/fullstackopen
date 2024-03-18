import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    set(state, action) {
      return action.payload
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

export const { set } = userSlice.actions
export default userSlice.reducer
