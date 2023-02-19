const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Teacher {
        _id: ID!
        first: String
        last: String
        school: String
    }

    type Post {
        _id: ID!
        teacherId: ID!
        itemName: String
        itemQuantity: Int
        createdAt: String
    }

    type PostRequest {
        _id: ID!
        teacherId: ID!
        postId: ID!
        count: Int
        reviewed: Boolean
        accepted: Boolean
    }

    type Auth {
        token: ID!
        teacher: Teacher!
    }

    input UserAuth {
        token: ID!
        id: ID!
    }

    type Query {
        allTeachers(page: Int!): [Teacher!]
        allPosts(page: Int!): [Post!]
        teacherFirstName(first: String!): [Teacher!]
        teacherLastName(last: String!): [Teacher!]
        teacherFirstLastName(first: String!, last: String!): [Teacher!]
        teacherUsername(username: String!): Teacher
        teacher(_id: ID!): Teacher
        postsForTeacher(teacherId: ID!): [Post!]
        requestsForTeacher(teacherId: ID!): [PostRequest!]
        postItem(itemName: String!): [Post!]
        post(_id: ID!): Post
        request(_id: ID!): PostRequest
    }

    type Mutation {
        createTeacher(username: String!, first: String!, last: String!, school: String!, password: String!): Auth
        login(username: String!, password: String!): Auth
        createPost(userAuth: UserAuth!, itemName: String!, itemQuantity: Int!): Post
        applyForSupply(userAuth: UserAuth!, postId: ID!, count: Int!): PostRequest
        supplyAccept(userAuth: UserAuth!, requestId: ID!): PostRequest
        supplyDeny(userAuth: UserAuth!, requestId: ID!): PostRequest
        removePost(userAuth: UserAuth!, postId: ID!): ID
        removeRequest(userAuth: UserAuth!, requestId: ID!): ID
        postUpdateQuantity(userAuth: UserAuth!, postId: ID!, newQuantity: Int!): Post
    }
`;

module.exports = typeDefs;
