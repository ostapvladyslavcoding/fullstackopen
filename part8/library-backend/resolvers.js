const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

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
      return Author.find({}).populate('books')
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      return root.books.length
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }
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
        author.books = author.books.concat(book._id)
        await author.save()
        const populatedBook = await book.populate('author')

        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
        return populatedBook
      } catch (error) {
        throw new GraphQLError('Book title is too short or not unique', {
          extensions: { code: 'BAD_USER_INPUT' },
          invalidArgs: args.title,
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name })

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

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
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })
      try {
        return user.save()
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: { code: 'BAD_USER_INPUT', error },
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
