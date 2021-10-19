const { User, Book } = require('../models')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers ={
    Query: {
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('books')
        },

        //get list of books for username
        books: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Book.find(params).sort({ title: -1 });
        }
    },

    Mutation: {
        //signup user
        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
          
            return { token, user };
        },

        //login user
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('This username and password combination is not correct.');
            }

            const correctPw = await user.isCorrectPassword(password);
          
            if (!correctPw) {
                throw new AuthenticationError('This username and password combination is not correct.');
            }
          
            const token = signToken(user);
            return { token, user };
        },

        //add a book to the user's saved list once logged in
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBook: bookData } },
                    { new: true }
                ).populate('books');
          
                return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in to save a book.');
        },
        
        //remove a book to the user's saved list once logged in
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser =  await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBook: bookData } },
                    { new: true }
                ).populate('books');
          
                return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in to remove a book.');
        },
    }
};

module.exports = resolvers;