import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'

import { StrictMode } from 'react'
import App from './App'
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  filter: filterReducer,
})

const store = createStore(reducer)

console.log(store.getState())

store.subscribe(() => console.log(store.getState()))

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
