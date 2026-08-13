// import { useState } from "react"
// import { useQuery, useMutation } from "@apollo/client/react"
// import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

// const Authors = ({ show, loggedIn }) => {
//   console.log("[Authors] Component rendered, show=", show)
  
//   const result = useQuery(ALL_AUTHORS)
  
//   console.log("[Authors] Query result:", { 
//     loading: result.loading,
//     error: result.error?.message,
//     dataExists: !!result.data,
//     authorsCount: result.data?.allAuthors?.length
//   })

//   const [born, setBorn] = useState("")
//   const [name, setName] = useState("")

//   const [editAuthor] = useMutation(EDIT_AUTHOR, {
//     refetchQueries: [{ query: ALL_AUTHORS }],
//   })

//   if (!show) {
//     return null
//   }

//   if (result.loading) {
//     return <div>loading...</div>
//   }

//   if (result.error) {
//     console.error("Query error:", result.error)
//     return <div>Error: {result.error.message}</div>
//   }

//   if (!result.data || !result.data.allAuthors) {
//     console.error("No data returned from query")
//     return <div>No data available</div>
//   }

//   const authors = result.data.allAuthors

//   const selectedName = name || authors[0]?.name || ""

//   const submit = async (event) => {
//     event.preventDefault()

//     await editAuthor({
//       variables: {
//         name: selectedName,
//         setBornTo: Number(born),
//       },
//     })

//     setBorn("")
//   }

//   return (
//     <div>
//       <h2>authors</h2>

//       <table>
//         <thead>
//           <tr>
//             <th></th>
//             <th>born</th>
//             <th>books</th>
//           </tr>
//         </thead>

//         <tbody>
//           {authors.map((author) => (
//             <tr key={author.name}>
//               <td>{author.name}</td>
//               <td>{author.born}</td>
//               <td>{author.bookCount}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {loggedIn && (
//         <>
//           <h2>Set birthyear</h2>

//           <form onSubmit={submit}>
//             <div>
//               <label htmlFor="author-name">
//                 name
//               </label>

// <select
//   id="author-name"
//   name="name"
//   value={selectedName}
//   onChange={({ target }) => setName(target.value)}
// >
//   {authors.map((author) => (
//     <option key={author.name} value={author.name}>
//       {author.name}
//     </option>
//   ))}
// </select>
//             </div>

//             <div>
// <label htmlFor="born">born</label>
// <input
//   id="born"
//   type="number"
//   value={born}
//   onChange={({ target }) => setBorn(target.value)}
// />
//             </div>

//             <button type="submit">
//               update author
//             </button>
//           </form>
//         </>
//       )}
//     </div>
//   )
// }

// export default Authors


import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

const Authors = ({ show, loggedIn }) => {
  console.log("[Authors] Component rendered, show=", show)
  
  const result = useQuery(ALL_AUTHORS)
  
  console.log("[Authors] Query result:", { 
    loading: result.loading,
    error: result.error?.message,
    dataExists: !!result.data,
    authorsCount: result.data?.allAuthors?.length
  })

  const [born, setBorn] = useState("")
  const [name, setName] = useState("")

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!show) {
    return null
  }

  // KEEP structural heading visible during loading so Playwright checks pass
  if (result.loading) {
    return (
      <div>
        <h2>authors</h2>
        <div>loading...</div>
      </div>
    )
  }

  if (result.error) {
    console.error("Query error:", result.error)
    return (
      <div>
        <h2>authors</h2>
        <div>Error: {result.error.message}</div>
      </div>
    )
  }

  if (!result.data || !result.data.allAuthors) {
    console.error("No data returned from query")
    return (
      <div>
        <h2>authors</h2>
        <div>No data available</div>
      </div>
    )
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
        <thead>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
        </thead>

        <tbody>
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
              <label htmlFor="author-name">
                name
              </label>

              <select
                id="author-name"
                name="name"
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
              <label htmlFor="born">born</label>
              <input
                id="born"
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>

            <button type="submit">
              update author
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors