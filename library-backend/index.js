require("dotenv").config()
const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")

const mongoose = require("mongoose")

const MONGODB_URI = "mongodb+srv://Kisimoniaubain_db_user:FyCql0Up9m9AfRmZ@cluster0.ldjzf1u.mongodb.net/library-app?appName=Cluster0"

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ connected to MongoDB")
  })
  .catch((error) => {
    console.log("❌ MongoDB connection error:")
    console.log(error.message)
  })


mongoose.connection.on("error", (error) => {
  console.log("MongoDB runtime error:", error)
})


// Models
const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: String,
    published: Number,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    genres: [String],
  })
)


const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
    born: Number,
  })
)


// GraphQL schema
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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genre: String
    ): [Book!]!

    allAuthors: [Author!]!
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
  }

`


// Resolvers
const resolvers = {

  Query: {

    bookCount: async () => {
      return await Book.countDocuments({})
    },


    authorCount: async () => {
      return await Author.countDocuments({})
    },


    allBooks: async (root, args) => {

      let filter = {}

      if (args.author) {

        const author = await Author.findOne({
          name: args.author,
        })

        if (author) {
          filter.author = author._id
        }
      }


      if (args.genre) {

        filter.genres = {
          $in: [args.genre],
        }

      }


      return await Book.find(filter).populate("author")

    },


    allAuthors: async () => {
      return await Author.find({})
    },

  },


  Mutation: {


    addBook: async (root, args) => {

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


      return await Book.findById(book._id)
        .populate("author")

    },


    editAuthor: async (root, args) => {

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


  Author: {

    bookCount: async (root) => {

      const books = await Book.find({
        author: root._id,
      })

      return books.length

    },

  },

}



// Start Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})


startStandaloneServer(server, {

  listen: {
    port: 4000,
  },

})
.then(({ url }) => {

  console.log(`Server ready at ${url}`)

})