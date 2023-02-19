const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Teacher {
        _id: ID!
        first: String
        last: String
        school: String
        supply_posts: [ID!]
        requests: [ID!]
    }

    type Post {
        _id: ID!
        teacherId: ID!
        itemName: String
        itemQuantity: Int
        createdAt: String
        requests: [ID!]
    }

    type PostRequest {
        _id: ID!
        teacherId: ID!
        postId: ID!
        count: Int
    }

    type Auth {
        token: ID!
        teacher: Teacher!
    }

    type Query {
        # TODO: remove this so nobody can query ALL of the teachers, or figure out a way to "chunk" it into 100 user groups
        allTeachers: [Teacher!]
        allPosts: [Post!]
        teacherFirstName(first: String!): [Teacher!]
        teacherLastName(last: String!): [Teacher!]
        teacherFirstLastName(first: String!, last: String!): [Teacher!]
        teacherUsername(username: String!): Teacher
        teacher(_id: ID!): Teacher
        postItem(itemName: String!): [Post!]
        post(_id: ID!): Post
        request(_id: ID!): PostRequest
    }

    type Mutation {
        createTeacher(username: String!, first: String!, last: String!, school: String!, password: String!): Auth
        login(username: String!, password: String!): Auth
        createPost(auth_token: ID!, teacherId: ID!, itemName: String!, itemQuantity: Int!): Post
        applyForSupply(auth_token: ID!, teacherId: ID!, postId: ID!, count: Int!): PostRequest
        # TODO: supply request accept
        # TODO: supply request deny
        # TODO: post removal
        # TODO: post quantity update
    }
`;

module.exports = typeDefs;
