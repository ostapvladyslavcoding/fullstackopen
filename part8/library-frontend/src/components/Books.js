const { useState } = require('react')

const Books = ({ books }) => {
  const [filter, setFilter] = useState('')
  const genres = [...new Set(books.flatMap((book) => book.genres))]
  const handleClick = (genre) => {
    setFilter(genre)
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
          {books
            .filter((book) => book.genres.includes(filter) || filter === '')
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          <tr>
            <td>
              <h3>Genres</h3>

              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleClick(genre)}
                >
                  {genre}
                </button>
              ))}
              <button
                key={'all'}
                onClick={() => handleClick('')}
              >
                {'all genres'}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Books
