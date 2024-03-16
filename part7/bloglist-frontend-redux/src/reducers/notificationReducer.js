import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    set(state, action) {
      return action.payload
    },
    clear() {
      return null
    },
  },
})

export const setNotification = (message, type, timer) => {
  return async (dispatch) => {
    dispatch(set({ message, type }))
    setTimeout(() => {
      dispatch(clear())
    }, timer * 1000)
  }
}

export const { set, clear } = notificationSlice.actions
export default notificationSlice.reducer
