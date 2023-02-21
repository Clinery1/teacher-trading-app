import {gql} from '@apollo/client';

export const POSTS = gql`
    query AllPosts($page: Int!, $category: String) {
        allPosts(page: $page, category: $category) {
            _id
            teacher {
                _id
                username
                first
                last
                school
            }
            category
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

export const POST = gql`
    query Post($id: ID!) {
        post(_id: $id) {
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

export const REQUESTS_FOR_POST = gql`
    query RequestsForPost($id: ID!) {
        requestsForPost(postId: $id) {
            _id
            teacher {
                _id
                username
                first
                last
                school
            }
            count
            reviewed
            accepted
        }
    }
`;

export const REQUESTS_FOR_TEACHER = gql`
    query RequestsForTeacher($teacherId: ID!) {
        requestsForTeacher(teacherId: $teacherId) {
            _id
            postId
            count
            reviewed
            accepted
        }
    }
`;

export const POSTS_FOR_TEACHER = gql`
    query PostsForTeacher($teacherId: ID!) {
        postsForTeacher(teacherId: $teacherId) {
            _id
            itemName
            itemQuantity
            createdAt
        }
    }
`;
