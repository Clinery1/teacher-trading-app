import {gql} from "@apollo/client";

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
mutation CreatePost($token: ID!, $itemName: String!, $itemQuantity: Int!, $category: String!) {
        createPost(token: $token, itemName: $itemName, itemQuantity: $itemQuantity, category: $category) {
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

export const ACCEPT_REQUEST = gql`
    mutation SupplyAccept($token: ID!, $requestId: ID!) {
        supplyAccept(token: $token, requestId: $requestId) {
            _id
        }
    }
`;

export const DENY_REQUEST = gql`
    mutation SupplyDeny($token: ID!, $requestId: ID!) {
        supplyDeny(token: $token, requestId: $requestId) {
            _id
        }
    }
`;

export const REMOVE_REQUEST = gql`
    mutation RemoveRequest($token: ID!, $requestId: ID!) {
        removeRequest(token: $token, requestId: $requestId)
    }
`;

export const REMOVE_POST = gql`
    mutation RemovePost($token: ID!, $postId: ID!) {
        removePost(token: $token, postId: $postId)
    }
`;

export const CREATE_REQUEST = gql`
    mutation ApplyForSupply($token: ID!, $postId: ID!, $count: Int!) {
        applyForSupply(token: $token, postId: $postId, count: $count) {
            _id
        }
    }
`;
