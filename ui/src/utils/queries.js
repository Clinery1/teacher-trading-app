import { gql } from '@apollo/client';

export const POSTS = gql`
    query AllPosts($page: Int!) {
        allPosts(page: $page) {
            _id
            teacher {
                _id
                username
                first
                last
                school
            }
            itemName
            itemQuantity
            createdAt
        }
    }
`;

export const TEACHER = gql`
    query Teacher($id: ID!) {
        teacher(_id: $id) {
            _id
            username
            first
            last
            school
        }
    }
`;
