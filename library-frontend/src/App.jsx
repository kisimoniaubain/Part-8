import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Login from "./components/Login"
import Recommendations from "./components/Recommendations"

const App = () => {
  const [page, setPage] = useState("authors")

  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  )

  const logout = () => {
    localStorage.removeItem("library-user-token")
    setToken(null)
    setPage("authors")
  }

  return (
    <div>
      <button onClick={() => setPage("authors")}>
        authors
      </button>

      <button onClick={() => setPage("books")}>
        books
      </button>

      {token ? (
        <>
          <button onClick={logout}>
            logout
          </button>

          <button onClick={() => setPage("add")}>
            add book
          </button>

          <button onClick={() => setPage("recommendations")}>
            recommend
          </button>
        </>
      ) : (
        <button onClick={() => setPage("login")}>
          login
        </button>
      )}

      <Authors
        show={page === "authors"}
        loggedIn={!!token}
      />

      <Books
        show={page === "books"}
      />

      <NewBook
        show={page === "add"}
      />

      <Login
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />

      <Recommendations
        show={page === "recommendations"}
      />
    </div>
  )
}

export default App