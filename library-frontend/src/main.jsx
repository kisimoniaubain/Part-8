import React from "react"
import ReactDOM from "react-dom/client"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client"
import { Observable } from "@apollo/client/core"
import { setContext } from "@apollo/client/link/context"

import App from "./App.jsx"

// Debug link to log all operations
const debugLink = new ApolloLink((operation, forward) => {
  const opName = operation.operationName || `Unnamed(${operation.query.loc?.source?.body?.substring(0, 20)}...)`
  console.log(`[Apollo] SEND: ${opName}`)
  
  return new Observable(subscriber => {
    forward(operation).subscribe({
      next: (data) => {
        console.log(`[Apollo] RECV: ${opName}`, data)
        subscriber.next(data)
      },
      error: (error) => {
        console.error(`[Apollo] ERROR: ${opName}`, error)
        subscriber.error(error)
      },
      complete: () => {
        subscriber.complete()
      }
    })
  })
})

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
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
  link: debugLink.concat(authLink).concat(httpLink),
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)