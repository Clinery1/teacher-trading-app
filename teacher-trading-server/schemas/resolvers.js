const { AuthenticationError } = require('apollo-server-express');
const { Teacher, Post, PostRequest } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        allTeachers: async () => {
            return Teacher.find();
        },

        allPosts: async () => {
            return Post.find();
        },

        teacherFirstName: async (_,{first}) => {
            return Teacher.find({first});
        },

        teacherLastName: async (_,{last}) => {
            return Teacher.find({last});
        },

        teacherFirstLastName: async (_,{first,last}) => {
            return Teacher.find({first,last});
        },

        teacherUsername: async (_,{username}) => {
            return Teacher.findOne({username});
        },

        teacher: async (_,{_id}) => {
            return Teacher.findOne({_id});
        },

        postItem: async (_,{itemName}) => {
            return Post.find({itemName});
        },

        post: async (_,{_id}) => {
            return Post.findOne({_id});
        },

        request: async (_,{_id}) => {
            return PostRequest.findOne({_id});
        },
    },
    Mutation: {
        createTeacher: async (_,args) => {
            const teacher = await Teacher.create(args);
            const token = signToken(teacher);

            // update the session token
            await Teacher.findOneAndUpdate(
                {_id:teacher._id},
                {last_session_id: token},
            );

            return {token, teacher};
        },

        login: async (_,{username, password}) => {
            const teacher = await Teacher.findOne({username});

            // throw an error if the username does nto exist
            if (!teacher) {
                throw new AuthenticationError("There is no teacher with this username");
            }

            // throw an error if the password is incorrect
            if (!await teacher.isCorrectPassword(password)) {
                throw new AuthenticationError("Incorrect password");
            }

            const token = signToken(teacher);

            // update the session token
            await Teacher.findOneAndUpdate(
                {_id:teacher._id},
                {last_session_id: token},
            );

            return {token, teacher};
        },

        createPost: async (_,{auth_token,teacherId,itemName,itemQuantity}) => {
            const teacher = await Teacher.findOne({_id: teacherId});

            if (!teacher) {
                throw new AuthenticationError("There is no teacher with this ID");
            }

            // check the auth token to make sure the user is actually who they say they are
            if (auth_token!==teacher.last_session_id) {
                throw new AuthenticationError("Invalid auth token");
            }

            const post = await Post.create({
                teacherId,
                itemName,
                itemQuantity,
            });

            // add the post to the teacher
            await Teacher.findOneAndUpdate(
                {_id: teacherId},
                {$addToSet: {"supply_posts": post._id}},
            );

            return post;
        },

        applyForSupply: async (_,{auth_token,teacherId,postId,count}) => {
            const teacher = await Teacher.findOne({_id: teacherId});
            const post = await Post.findOne({_id: postId});

            // check if the post and the teacher exist
            if (!teacher) {
                throw new AuthenticationError("There is no teacher with this ID");
            }
            if (!post) {
                throw new AuthenticationError("There is no post with this ID");
            }

            // check the auth token to make sure the user is actually who they say they are
            if (auth_token!==teacher.last_session_id) {
                throw new AuthenticationError("Invalid auth token");
            }

            // check if the teacher asking and the post's teacher are the same
            if (post.teacherId===teacherId) {
                throw new AuthenticationError("Cannot apply for your own post");
            }

            const request = await PostRequest.create({
                teacherId,
                postId,
                count,
            });

            // add the request to the post and the teacher
            await Teacher.findOneAndUpdate(
                {_id: teacherId},
                {$addToSet: {"requests": request._id}},
            );
            await Post.findOneAndUpdate(
                {_id: postId},
                {$addToSet: {"requests": request._id}},
            );

            return request;
        },
    },
};

module.exports = resolvers;
