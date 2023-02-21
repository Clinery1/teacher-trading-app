const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Teacher {
        _id: ID!
        username: String
        first: String
        last: String
        school: String
    }

    type Post {
        _id: ID!
        teacher: Teacher
        itemName: String
        itemQuantity: Int
        createdAt: String
        category: String
    }

    type PostRequest {
        _id: ID!
        teacher: Teacher
        postId: ID!
        count: Int
        reviewed: Boolean
        accepted: Boolean
    }

    type Auth {
        token: ID!
        user: Teacher!
    }

    type Query {
        allTeachers(page: Int!): [Teacher!]
        allPosts(page: Int!, category: String): [Post!]
        teacherFirstName(first: String!): [Teacher!]
        teacherLastName(last: String!): [Teacher!]
        teacherFirstLastName(first: String!, last: String!): [Teacher!]
        teacherUsername(username: String!): Teacher
        teacher(_id: ID!): Teacher
        postsForTeacher(teacherId: ID!): [Post!]
        requestsForTeacher(teacherId: ID!): [PostRequest!]
        requestsForPost(postId: ID!): [PostRequest!]
        postItem(itemName: String!): [Post!]
        post(_id: ID!): Post
        request(_id: ID!): PostRequest
    }

    type Mutation {
        createTeacher(username: String!, first: String!, last: String!, school: String!, password: String!): Auth
        login(username: String!, password: String!): Auth
        createPost(token: ID!, itemName: String!, itemQuantity: Int!, category: String!): Post
        applyForSupply(token: ID!, postId: ID!, count: Int!): PostRequest
        supplyAccept(token: ID!, requestId: ID!): PostRequest
        supplyDeny(token: ID!, requestId: ID!): PostRequest
        removePost(token: ID!, postId: ID!): ID
        removeRequest(token: ID!, requestId: ID!): ID
        postUpdateQuantity(token: ID!, postId: ID!, newQuantity: Int!): Post
    }
`;

module.exports = typeDefs;
