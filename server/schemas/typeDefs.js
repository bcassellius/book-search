// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
    type Query {
        me: User
        users: [User]
        user(username: String!): User
        books(username: String): [Book]
    }

    type Mutation {
        login(email: String!, password: String!):Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookData: BookInput):User
        removeBook(bookId: Int):User
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }
`;

// export the typeDefs
module.exports = typeDefs;