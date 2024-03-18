import { configureStore } from '@reduxjs/toolkit'

import blogsReducer from './reducers/blogsReducer'
import loginReducer from './reducers/loginReducer'
import notificationReducer from './reducers/notificationReducer'
import usersReducer from './reducers/usersReducer'

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notification: notificationReducer,
    user: loginReducer,
    users: usersReducer,
  },
})

console.log(store.getState())

store.subscribe(() => console.log(store.getState()))

export default store
