require("dotenv").config()
const jwt = require("jsonwebtoken")
const User = require("./models/user")

const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { GraphQLError } = require("graphql")
const mongoose = require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

console.log("Mongo URI:", MONGODB_URI)

// =====================
// Models
// =====================

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 5,
    },

    published: {
      type: Number,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },

    genres: {
      type: [String],
      required: true,
    },
  })
)

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 4,
    },

    born: Number,
  })
)

// =====================
// GraphQL Schema
// =====================

const typeDefs = `

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!

    allBooks(
      author: String
      genre: String
    ): [Book!]!

    allAuthors: [Author!]!

    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

    _resetDatabase: Boolean
  }
`

// =====================
// Resolvers
// =====================

const resolvers = {
  Query: {
    me: async (root, args, context) => {
      return context.currentUser
    },

    bookCount: async () => {
      return await Book.countDocuments({})
    },

    authorCount: async () => {
      return await Author.countDocuments({})
    },

    allBooks: async (root, args) => {
      let query = {}

      if (args.author) {
        const author = await Author.findOne({
          name: args.author,
        })

        if (!author) {
          return []
        }

        query.author = author._id
      }

      if (args.genre) {
        query.genres = {
          $in: [args.genre],
        }
      }

      return await Book.find(query).populate("author")
    },

    allAuthors: async () => {
      return await Author.find({})
    },
  },

  Mutation: {
    // =====================
    // Create user
    // =====================

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return await user.save()
    },

    // =====================
    // Reset database
    // =====================

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError(
          "_resetDatabase is only available in test mode"
        )
      }

      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})

      return true
    },

    // =====================
    // Login
    // =====================

    login: async (root, args) => {
      const user = await User.findOne({
        username: args.username,
      })

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      // Hardcoded password for the exercise
      if (args.password !== "secret") {
        throw new GraphQLError("Invalid password", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: jwt.sign(userForToken, JWT_SECRET),
      }
    },

    // =====================
    // Add book
    // =====================

    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        })
      }

      try {
        let author = await Author.findOne({
          name: args.author,
        })

        if (!author) {
          author = new Author({
            name: args.author,
          })

          await author.save()
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        })

        await book.save()

        return await Book
          .findById(book._id)
          .populate("author")
      } catch (error) {
        throw new GraphQLError(
          "Creating the book failed: " + error.message,
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        )
      }
    },

    // =====================
    // Edit author
    // =====================

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        })
      }

      const author = await Author.findOne({
        name: args.name,
      })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

      await author.save()

      return author
    },
  },

  // =====================
  // Author resolver
  // =====================

  Author: {
    bookCount: async (root) => {
      const books = await Book.find({
        author: root._id,
      })

      return books.length
    },
  },
}

// =====================
// Start Server
// =====================

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI)

    console.log("✅ connected to MongoDB")

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    })

    const { url } = await startStandaloneServer(server, {
      listen: {
        port: 4000,
      },

      // =====================
      // Authentication context
      // =====================

      context: async ({ req }) => {
        const authorization = req.headers.authorization

        if (!authorization) {
          return {}
        }

        try {
          const token = authorization.replace("Bearer ", "")

          const decodedToken = jwt.verify(
            token,
            JWT_SECRET
          )

          const currentUser = await User.findById(
            decodedToken.id
          )

          return {
            currentUser,
          }
        } catch (error) {
          return {}
        }
      },
    })

    console.log(`Server ready at ${url}`)
  } catch (error) {
    console.log("❌ Server startup error:")
    console.log(error.message)
  }
}

startServer()