import React from "react"
import ReactDOM from "react-dom/client"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

import App from "./App.jsx"

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("library-user-token")

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)