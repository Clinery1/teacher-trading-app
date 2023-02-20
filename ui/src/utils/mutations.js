import { gql } from "@apollo/client";

export const ADD_TEACHER = gql`
    mutation createTeacher($username: String!, $first: String!, $last: String!, $school: String!, $password: String!) {
        createTeacher(username: $username, first: $first, last: $last, school: $school, password: $password) {
            token
            user {
                _id
                first
                last
                school
            }
        }
    }
`;

export const LOGIN_TEACHER = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
            user {
                _id
                first
                last
                school
            }
        }
    }
`;

export const CREATE_POST = gql`
    mutation CreatePost($token: ID!, $itemName: String!, $itemQuantity: Int!) {
        createPost(token: $token, itemName: $itemName, itemQuantity: $itemQuantity) {
            _id
            teacher {
                _id
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
