const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
type Author {
  name: String!
  id: ID!
  born: Int
  bookCount: Int!
}

type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
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
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const authorFilter = args.author
        ? { author: await Author.findOne({ name: args.author }) }
        : {}
      const genreFilter = args.genre ? { genres: { $in: args.genre } } : {}
      return Book.find({ ...authorFilter, ...genreFilter }).populate('author')
    },
    allAuthors: async () => {
      return Author.find({})
    },
  },
  Author: {
    bookCount: async (root) => {
      return Book.collection.countDocuments({ author: root._id })
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        try {
          author = await Author.create({ name: args.author })
        } catch (error) {
          throw new GraphQLError('Author name is too short', {
            extensions: { code: 'BAD_USER_INPUT' },
            invalidArgs: args.author,
          })
        }
      }
      try {
        const book = await Book.create({ ...args, author: author._id })
        return book.populate('author')
      } catch (error) {
        throw new GraphQLError('Book title is too short or not unique', {
          extensions: { code: 'BAD_USER_INPUT' },
          invalidArgs: args.title,
        })
      }
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      try {
        const updatedAuthor = await Author.findByIdAndUpdate(
          author.id,
          { born: args.setBornTo },
          { new: true }
        )
        return updatedAuthor
      } catch (error) {
        throw new GraphQLError('Updating author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
