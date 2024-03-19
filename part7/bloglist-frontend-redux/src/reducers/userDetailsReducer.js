import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'
import { setNotification } from './notificationReducer'

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: null,
  reducers: {
    setDetails(state, action) {
      return action.payload
    },
    clearDetails(state, action) {
      return null
    },
  },
})

export const initializeUserDetails = (id) => {
  return async (dispatch) => {
    try {
      const user = await userService.getUser(id)
      dispatch(setDetails(user))
    } catch (error) {
      console.error(error)
      dispatch(setNotification('Error initializing user', 'error', 5))
    }
  }
}

export const { setDetails, clearDetails } = userDetailsSlice.actions
export default userDetailsSlice.reducer
