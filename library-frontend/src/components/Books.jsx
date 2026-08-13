import { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS } from "../queries"

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)

  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre,
    },
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    console.error("Query error:", result.error)
    return <div>Error: {result.error.message}</div>
  }

  if (!result.data || !result.data.allBooks) {
    console.error("No data returned from query")
    return <div>No data available</div>
  }

  const books = result.data.allBooks

  const genres = [
    "refactoring",
    "classic",
    "crime",
    "agile",
    "patterns",
    "design",
  ]

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
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genreName) => (
          <button
            key={genreName}
            onClick={() => setGenre(genreName)}
          >
            {genreName}
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