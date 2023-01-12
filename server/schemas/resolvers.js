const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        //get the user without their password and populate their saved books
        me: async (parent, args, context) => {
            if (context.user) {
                console.log(context.user)
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks');
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        // create a user and a corresponding token
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        }, 
        //login the user with their credentials, otherwise throw authentication errors
        login: async (parent, { email, password }) => {

            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        }, 
        // add a book to the user's saved books list and prevent duplicate books from being saved by adding to set
        // similar to addFriend in deep-thoughts project
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    //prevent duplicates, add book to savedBooks, will populate in me query
                    { $addToSet: { savedBooks: {bookId: args.bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            // if not logged in/unathenticated user, throw error
            throw new AuthenticationError('Please log in to save this book.')
        },
        //TODO: find a user based on the context, after finding the user we pull from the user's saved books, pull the args.bookId
        removeBook: async (parent, args, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
              );
              if (!updatedUser) {
                throw new AuthenticationError("Couldn't find user with this id!");
              }
              return (updatedUser);
        }
    }
};

module.exports = resolvers;