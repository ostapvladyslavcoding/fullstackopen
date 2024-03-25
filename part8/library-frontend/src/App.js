import { useApolloClient, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  if (authors.loading || books.loading) {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const NavBar = () => (
    <div>
      <Link to='/'>
        <button>authors</button>
      </Link>
      <Link to='/books'>
        <button>books</button>
      </Link>
      {token && (
        <Link to='/add_book'>
          <button>add book</button>
        </Link>
      )}
      {token ? (
        <button onClick={logout}>logout </button>
      ) : (
        <Link to='/login'>
          <button>login</button>
        </Link>
      )}
    </div>
  )

  const RouteDisplay = () => (
    <Routes>
      <Route
        path='/'
        element={
          <Authors
            token={token}
            authors={authors.data.allAuthors}
          />
        }
      />
      <Route
        path='/books'
        element={<Books books={books.data.allBooks} />}
      />
      <Route
        path='/add_book'
        element={
          token ? (
            <NewBook />
          ) : (
            <Navigate
              replace
              to='/login'
            />
          )
        }
      />
      <Route
        path='/login'
        element={<LoginForm setToken={setToken} />}
      />
    </Routes>
  )

  return (
    <div>
      <NavBar />
      <RouteDisplay />
    </div>
  )
}

export default App
