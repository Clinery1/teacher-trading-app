const { AuthenticationError } = require('apollo-server-express');
const { Teacher, Post, PostRequest } = require('../models');
const { signToken, verifyToken } = require('../utils/auth');

const resolvers = {
    Query: {
        allTeachers: async (_,{page}) => {
            const limit=100;
            const skip=page*limit;
            return Teacher.find({},null,{limit,skip});
        },

        allPosts: async (_,{page}) => {
            const limit=100;
            const skip=page*limit;
            return Post.find({},null,{limit,skip});
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

        postsForTeacher: async (_,{teacherId}) => {
            return await Post.find({teacherId});
        },

        requestsForTeacher: async (_,{teacherId}) => {
            return await PostRequest.find({teacherId});
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

            return token;
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

            return token;
        },

        createPost: async (_,{token,itemName,itemQuantity}) => {
            const teacher = verifyToken(token);

            const post = await Post.create({
                teacherId: teacher._id,
                itemName,
                itemQuantity,
            });

            return post;
        },

        applyForSupply: async (_,{token,postId,count}) => {
            const teacher = verifyToken(token);
            const post = await Post.findOne({_id: postId});

            // check if the post and the teacher exist
            if (!post) {
                throw new AuthenticationError("There is no post with this ID");
            }

            // check if the teacher asking and the post's teacher are the same
            if (post.teacherId==teacher._id) {
                throw new AuthenticationError("Cannot apply for your own post");
            }

            const request = await PostRequest.create({
                teacherId: teacher._id,
                postId,
                count,
            });

            return request;
        },

        supplyAccept: async (_,{token,requestId}) => {
            const teacher = verifyToken(token);

            const request = await PostRequest.findOne({_id: requestId});

            if (!request) {
                throw new AuthenticationError("There is not a request with this ID");
            }

            const post = await Post.findOne({_id: request.postId});

            if (!post) {
                throw new AuthenticationError("The post tied to the request was deleted");
            }

            if (post.teacherId!=teacher._id) {
                throw new AuthenticationError("Cannot accept a request for another person's post");
            }

            const remainingQuantity = post.itemQuantity-request.count;

            if (remainingQuantity<0) {
                throw new AuthenticationError("Cannot accept a request for more that what is listed");
            }

            await Post.findOneAndUpdate(
                {_id: post._id},
                {itemQuantity: remainingQuantity},
            );

            return await PostRequest.findOneAndUpdate(
                {_id: requestId},
                {reviewed: true, accepted: true},
                {new: true},
            );
        },

        supplyDeny: async (_,{token,requestId}) => {
            const teacher = verifyToken(token);

            const request = await PostRequest.findOne({_id: requestId});

            if (!request) {
                throw new AuthenticationError("There is not a request with this ID");
            }

            const post = await Post.findOne({_id: request.postId});

            if (!post) {
                throw new AuthenticationError("The post tied to the request was deleted");
            }

            if (post.teacherId!=teacher._id) {
                throw new AuthenticationError("Cannot accept a request for another person's post");
            }

            return await PostRequest.findOneAndUpdate(
                {_id: requestId},
                {reviewed: true, accepted: false},
                {new: true},
            );
        },

        removePost: async (_,{token,postId}) => {
            const teacher = verifyToken(token);

            const post = await Post.findOne({_id: postId});

            if (!post) {
                throw new AuthenticationError("There is not a post with this ID");
            }

            // check if the user is the owner of the post
            if (post.teacherId!=teacher._id) {
                throw new AuthenticationError("Cannot remove another person's post");
            }

            // deny all of the associated requests
            await PostRequest.updateMany(
                {postId},
                {reviewed: true, accepted: false},
            );

            await Post.findOneAndDelete({_id: postId});

            return post._id;
        },

        removeRequest: async (_,{token,requestId}) => {
            const teacher = verifyToken(token);

            const request = await PostRequest.findOne({_id: requestId});

            if (!request) {
                throw new AuthenticationError("There is not a request with this ID");
            }

            // check if the user is the owner of the request
            if (request.teacherId!=teacher._id) {
                throw new AuthenticationError("Cannot remove another person's request");
            }

            await PostRequest.findOneAndDelete({_id: requestId});

            return request._id;
        },

        postUpdateQuantity: async (_,{token,postId,newQuantity}) => {
            const teacher = verifyToken(token);

            const post = await Post.findOne({_id: postId});

            if (!post) {
                throw new AuthenticationError("There is not a post with this ID");
            }

            // check if the user is the owner of the request
            if (post.teacherId!=teacher._id) {
                throw new AuthenticationError("Cannot update another person's post");
            }

            return await Post.findOneAndUpdate(
                {_id: postId},
                {itemQuantity: newQuantity},
                {new: true},
            );
        },
    },
};


module.exports = resolvers;
