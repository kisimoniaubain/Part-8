import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

const Authors = ({ show, loggedIn }) => {
  const result = useQuery(ALL_AUTHORS)

  const [born, setBorn] = useState("")
  const [name, setName] = useState("")

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const selectedName = name || authors[0]?.name || ""

  const submit = async (event) => {
    event.preventDefault()

    await editAuthor({
      variables: {
        name: selectedName,
        setBornTo: Number(born),
      },
    })

    setBorn("")
  }

  return (
    <div>
      <h2>authors</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>

          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {loggedIn && (
        <>
          <h2>Set birthyear</h2>

          <form onSubmit={submit}>
            <div>
              name
              <select
                value={selectedName}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map((author) => (
                  <option key={author.name} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              born
              <input
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>

            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors