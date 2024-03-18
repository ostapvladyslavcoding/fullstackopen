import { configureStore } from '@reduxjs/toolkit'

import blogDetailsReducer from './reducers/blogDetailsReducer'
import blogsReducer from './reducers/blogsReducer'
import loginReducer from './reducers/loginReducer'
import notificationReducer from './reducers/notificationReducer'
import userDetailsReducer from './reducers/userDetailsReducer'
import usersReducer from './reducers/usersReducer'

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notification: notificationReducer,
    user: loginReducer,
    users: usersReducer,
    blogDetails: blogDetailsReducer,
    userDetails: userDetailsReducer,
  },
})

console.log(store.getState())

store.subscribe(() => console.log(store.getState()))

export default store
