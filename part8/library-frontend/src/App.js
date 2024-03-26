import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(
        `A new book ${addedBook.title} by ${addedBook.author.name} added`
      )

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

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
        <>
          <Link to='/add_book'>
            <button>add book</button>
          </Link>

          <Link to='/recommend'>
            <button>recommend</button>
          </Link>
        </>
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

      <Route
        path='/recommend'
        element={
          token ? (
            <Recommendations />
          ) : (
            <Navigate
              replace
              to='/login'
            />
          )
        }
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
