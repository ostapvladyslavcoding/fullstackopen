import { useLazyQuery, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, BOOK_GENRES } from '../queries'

const Books = () => {
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [filter, setFilter] = useState('')

  const queryBooks = useQuery(ALL_BOOKS, {
    onCompleted: (data) => {
      setBooks(data.allBooks)
    },
  })

  const queryGenres = useQuery(BOOK_GENRES, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const unique = data.allBooks.reduce((acc, book) => {
        book.genres.forEach((genre) => {
          if (!acc.includes(genre)) {
            acc.push(genre)
          }
        })
        return acc
      }, [])
      setGenres(unique)
    },
  })

  const queryFiltered = useLazyQuery(ALL_BOOKS, {
    variables: { genre: filter },
    onCompleted: (data) => {
      setBooks(data.allBooks)
    },
  })

  if (queryBooks.loading || queryGenres.loading) {
    return <div>loading...</div>
  }

  const handleClick = async (genre) => {
    setFilter(genre)
    if (genre === '') {
      queryBooks.refetch()
    } else {
      queryFiltered[0]()
    }
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
          <tr>
            <td>
              <h3>Genres</h3>

              {genres.map((genre) => {
                return (
                  <button
                    key={genre}
                    onClick={() => handleClick(genre)}
                  >
                    {genre}
                  </button>
                )
              })}
              <button
                type='button'
                onClick={() => handleClick('')}
              >
                all genres
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Books
