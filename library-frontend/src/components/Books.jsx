import { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS } from "../queries"

const Books = ({ show }) => {
  const result = useQuery(ALL_BOOKS)

  const [genre, setGenre] = useState(null)

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  const filteredBooks = genre
    ? books.filter((book) => book.genres.includes(genre))
    : books

  const genres = [...new Set(books.flatMap((book) => book.genres))]

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}

      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>

        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setGenre(genre)}
          >
            {genre}
          </button>
        ))}

        <button onClick={() => setGenre(null)}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books