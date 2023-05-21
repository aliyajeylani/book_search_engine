import { gql } from '@apollo/client';

export const GET_ME = gql`
        query me {
            me {
                _id
                username
                email
                savedBooks {
                  bookId
                  description
                  authors
                }
            }
        }
`;

export const QUERY_BOOKS = `gql
            query books {
                books {
                    bookId
                    authors
                    Description
                }
            }
`