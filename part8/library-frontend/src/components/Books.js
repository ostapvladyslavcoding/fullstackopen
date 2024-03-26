import { useLazyQuery, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const [filter, setFilter] = useState('')
  const [books, setBooks] = useState([])

  const booksQuery = useQuery(ALL_BOOKS, {
    onCompleted: (result) => {
      setBooks(result.allBooks)
    },
    onError: (error) => {
      console.log('HERE', error)
    },
  })

  const [booksByGenre] = useLazyQuery(ALL_BOOKS, {
    variables: { genre: filter },
    fetchPolicy: 'no-cache',
    onCompleted: (result) => {
      setBooks(result.allBooks)
    },
    onError: (error) => {
      console.log('HERE2', error)
    },
  })

  const genres = [...new Set(books.flatMap((book) => book.genres))]

  const handleClick = (genre) => {
    setFilter(genre)

    if (genre === '') {
      booksQuery.refetch()
    } else {
      booksByGenre({ variables: { genre } })
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
              <button onClick={() => handleClick('')}>all genres</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Books
