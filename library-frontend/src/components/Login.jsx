import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const Login = ({ show, setToken }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [login] = useMutation(LOGIN)

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const result = await login({
      variables: {
        username,
        password,
      },
    })

    const token = result.data.login.value

    localStorage.setItem("library-user-token", token)
    setToken(token)

    setUsername("")
    setPassword("")
  }

  return (
    <div>
      <h2>login</h2>

      <form onSubmit={submit}>
        <div>
          name
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login