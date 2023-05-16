const { AuthenticationError } = require('apollo-server-express');
const {User, Book} = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('savedBooks')
        },
    me: async (parent, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user_id}).populate('savedBooks');
        }
        throw new AuthenticationError('You need to be logged in!');
    }
    
},

Mutation: {
    addUser: async (parent, {username, email, password}) => {
        const user = await User.create({username,email, password});
        const token = signToken(user);
        return { token, user };
    },
    login: async (parent, {email, password}) => {
        const user = await User.findOne({ email });

        if(!user) {
            throw new AuthenticationError('No user found with this email address');
        }

        const correctPw = await user.isCorrectPassword(password);

        if(!correctPw) {
            throw new AuthenticationError('Incorrext credentials');
        }
        
        const token = signToken(user);

        return { token, user };
    },

    savedBook: async (parent, { authors }, context) => {
        if(context.user) {
            const book = await Book.create({
                authors,
                description,
                title,
                image,
                link
            });

            await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { books: book._id }}
                );

                return book;
        }
        throw new AuthenticationError ('You need to be logged in!');
    },

    removeBook: async (parent, { bookId }, context ) => {
        if(context.user) {
            return Book.findOneAndUpdate(
                { _id: bookId },
                { new: true }
            );
        }
        throw new AuthenticationError('You need to be logged in!');
    },
},

};