import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },

    removeNotification() {
      return null
    },
  },
})

export const { showNotification, removeNotification } =
  notificationSlice.actions

export const setNotification = (message, timer) => {
  return async (dispatch) => {
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timer * 1000)
  }
}

export default notificationSlice.reducer
