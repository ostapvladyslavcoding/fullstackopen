import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = () => {
  const [books, setBooks] = useState([])
  const [favoriteGenre, setFavoriteGenre] = useState(null)

  const user = useQuery(ME, {
    onCompleted: (result) => {
      setFavoriteGenre(result.me.favoriteGenre)
    },
  })

  const booksQuery = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    onCompleted: (result) => {
      setBooks(result.allBooks)
    },
  })

  if (user.loading || booksQuery.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

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
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
