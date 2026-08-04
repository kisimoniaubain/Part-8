const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { v1: uuid } = require("uuid")

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky",
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz",
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
]

const typeDefs = `
  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    // Exercise 8.1
    bookCount: () => books.length,

    // Exercise 8.1
    authorCount: () => authors.length,

    // Exercises 8.2, 8.4 and 8.5
    allBooks: (root, args) => {
      let filteredBooks = books

      // Filter by author
      if (args.author) {
        filteredBooks = filteredBooks.filter(
          (book) => book.author === args.author
        )
      }

      // Filter by genre
      if (args.genre) {
        filteredBooks = filteredBooks.filter(
          (book) => book.genres.includes(args.genre)
        )
      }

      return filteredBooks
    },

    // Exercise 8.3
    allAuthors: () =>
      authors.map((author) => ({
        ...author,
        bookCount: books.filter(
          (book) => book.author === author.name
        ).length,
      })),
  },

  Mutation: {
    // Exercise 8.6
    addBook: (root, args) => {
      const book = {
        title: args.title,
        author: args.author,
        published: args.published,
        genres: args.genres,
        id: uuid(),
      }

      // Add the new book
      books = books.concat(book)

      // Check if author already exists
      const authorExists = authors.find(
        (author) => author.name === args.author
      )

      // If author does not exist, create a new author
      if (!authorExists) {
        authors = authors.concat({
          name: args.author,
          id: uuid(),
        })
      }

      return book
    },

    // Exercise 8.7
    editAuthor: (root, args) => {
      const author = authors.find(
        (author) => author.name === args.name
      )

      // Return null if author does not exist
      if (!author) {
        return null
      }

      // Update author's birth year
      author.born = args.setBornTo

      return author
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})