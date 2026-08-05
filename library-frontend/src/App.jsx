import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"

const App = () => {
  const [page, setPage] = useState("authors")

  return (
    <div>
      <button onClick={() => setPage("authors")}>
        authors
      </button>

      <button onClick={() => setPage("books")}>
        books
      </button>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
    </div>
  )
}

export default App