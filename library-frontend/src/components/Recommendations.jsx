import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ME } from "../queries"

const Recommendations = ({ show }) => {
  // Fetch current user details
  const meResult = useQuery(ME, {
    skip: !show,
    fetchPolicy: "cache-and-network"
  })

  const favoriteGenre = meResult.data?.me?.favoriteGenre

  // Fetch only books matching the user's favorite genre
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre || !show,
  })

  if (!show) {
    return null
  }

  // Always keep the heading in the DOM so Playwright doesn't instantly throw an error
  return (
    <div>
      <h2>recommendations</h2>

      {meResult.loading || booksResult.loading ? (
        <div>loading...</div>
      ) : !meResult.data?.me ? (
        <div>not logged in</div>
      ) : (
        <>
          <p>
            books in your favorite genre <strong>{favoriteGenre}</strong>
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
              {booksResult.data?.allBooks?.map((book) => (
                <tr key={book.title}>
                  <td>{book.title}</td>
                  <td>{book.author?.name}</td>
                  <td>{book.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default Recommendations