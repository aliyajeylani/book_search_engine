const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user_id }).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        }

    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            console.log(username, email);
            const user = await User.create({ username, email, password });
            console.log(user);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrext credentials');
            }

            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { savedBook }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: savedBook } },
                    { new: true }
                );

            }
            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: savedBook } },
                    { new: true }
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

};

module.exports = resolvers;