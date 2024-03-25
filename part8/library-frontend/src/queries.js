import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
      }
      genres
    }
  }
`

export const CREATE_BOOK = gql`
  mutation (
    $title: String!
    $published: Int!
    $genres: [String!]!
    $author: String!
  ) {
    addBook(
      title: $title
      published: $published
      genres: $genres
      author: $author
    ) {
      genres
      published
      title
      author {
        name
      }
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation ($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
