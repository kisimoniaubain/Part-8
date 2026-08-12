import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { ALL_BOOKS, ADD_BOOK } from "../queries"

const NewBook = ({ show }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      {
        query: ALL_BOOKS,
        variables: {
          genre: null,
        },
      },
    ],
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    await addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres: [genre],
      },
    })

    setTitle("")
    setAuthor("")
    setPublished("")
    setGenre("")
  }

  return (
    <div>
      <h2>add book</h2>

      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>

        <div>
          genre
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
        </div>

        <button type="submit">
          add book
        </button>
      </form>
    </div>
  )
}

export default NewBook