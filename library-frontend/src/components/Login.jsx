import { useState } from "react"
import { useMutation, useApolloClient } from "@apollo/client"
import { gql } from "@apollo/client"
import { ME } from "../queries"

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const Login = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const client = useApolloClient()

  const [login] = useMutation(LOGIN)

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    setError(null)

    try {
      const result = await login({
        variables: { username, password },
      })

      const token = result.data.login.value

      localStorage.setItem("library-user-token", token)
      setToken(token)
      
      // Explicitly refetch ME query to tie the new token context to the user payload
      await client.refetchQueries({
        include: [ME],
      })

      setPage("authors")
      setUsername("")
      setPassword("")
    } catch (error) {
      setError("login failed")
    }
  }

  return (
    <div>
      <h2>login</h2>
      {error && <div>{error}</div>}
      <form onSubmit={submit}>
        <label htmlFor="username">username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />

        <label htmlFor="password">password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login