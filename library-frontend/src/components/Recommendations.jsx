import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS, ME } from "../queries"


const Recommendations = ({ show }) => {
  const meResult = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS)

  if (!show) {
    return null
  }

  if (meResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  if (!meResult.data.me) {
    return <div>not logged in</div>
  }

  const favoriteGenre = meResult.data.me.favoriteGenre

  const books = booksResult.data.allBooks.filter((book) =>
    book.genres.includes(favoriteGenre)
  )

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre{" "}
        <strong>{favoriteGenre}</strong>
      </p>

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
    </div>
  )
}

export default Recommendations