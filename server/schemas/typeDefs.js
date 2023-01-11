// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
// TODO: in saveBookInput does bookId need to be String or Int "bookId is not the _id, but the book's id value returned from Google's Book API" - Challenge notes
//TODO: What is the type for image??? Would it be string since it'll return an image url/link?
// TODO: how do you write removeBook in type Mutation? (removeBook(bookId: ___): User)
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type: Book {
    bookId: _____
    authors: [String]
    description: String
    title: String
    image: _____
    link: String
  }

  input SaveBookInput {
    bookId: _____
    authors: [String]
    description: String
    title: String
    image: _____
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SaveBookInput): User
    removeBook: _____
  }
`;


// export the typeDefs
module.exports = typeDefs;