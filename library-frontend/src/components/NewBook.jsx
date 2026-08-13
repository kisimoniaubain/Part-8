import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { ALL_BOOKS, ADD_BOOK } from "../queries"

const NewBook = ({ show }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])

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
        genres,
      },
    })

    setTitle("")
    setAuthor("")
    setPublished("")
    setGenre("")
    setGenres([])
  }

  const addGenre = () => {
    if (genre.trim() !== "") {
      setGenres([...genres, genre.trim()])
      setGenre("")
    }
  }

  return (
    <div>
      <h2>add book</h2>

      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">title</label>
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          <label htmlFor="author">author</label>
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
          <label htmlFor="published">published</label>
          <input
            id="published"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>

        <div>
          <label htmlFor="genre">genre</label>
          <input
            id="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />

          <button
            type="button"
            onClick={addGenre}
          >
            add genre
          </button>
        </div>

        {genres.length > 0 && (
          <div>
            genres: {genres.join(", ")}
          </div>
        )}

        <button type="submit">
          create book
        </button>
      </form>
    </div>
  )
}

export default NewBook