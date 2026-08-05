require("dotenv").config()

const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { GraphQLError } = require("graphql")
const mongoose = require("mongoose")


const MONGODB_URI = process.env.MONGODB_URI

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



// =====================
// Resolvers
// =====================

const resolvers = {


  Query: {

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



      return await Book
        .find(query)
        .populate("author")

    },



    allAuthors: async () => {

      return await Author.find({})

    },

  },



  Mutation: {


    addBook: async (root, args) => {

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

    })



    console.log(`Server ready at ${url}`)



  } catch (error) {


    console.log("❌ Server startup error:")
    console.log(error.message)


  }

}



startServer()