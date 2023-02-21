const { AuthenticationError } = require("apollo-server-express");
const { Teacher, Post, PostRequest } = require("../models");
const { signToken, verifyToken } = require("../utils/auth");

const resolvers = {
    Query: {
        allTeachers: async (_,{page}) => {
            const limit = 100;
            const skip = page*limit;
            return await Teacher.find({},null,{limit,skip});
        },

        allPosts: async (_,{page,category}) => {
            console.log(category);
            let teacherIds = {};
            const limit = 100;
            const skip = page*limit;
            let query = {};
            if (category) {
                query.category = category;
            }
            let posts = await Post.find(query,null,{limit,skip});
            for (let i=0;i<posts.length;i+=1) {
                let id = posts[i].teacherId;
                if (!teacherIds[id]) {
                    teacherIds[id] = await Teacher.findOne({_id: id});
                }
                posts[i] = {
                    teacher: teacherIds[id],
                    ...posts[i]._doc,
                };
            }

            return posts;
        },

        teacherFirstName: async (_,{first}) => {
            return await Teacher.find({first});
        },

        teacherLastName: async (_,{last}) => {
            return await Teacher.find({last});
        },

        teacherFirstLastName: async (_,{first,last}) => {
            return await Teacher.find({first,last});
        },

        teacherUsername: async (_,{username}) => {
            return await Teacher.findOne({username});
        },

        teacher: async (_,{_id}) => {
            return await Teacher.findOne({_id});
        },

        postsForTeacher: async (_,{teacherId}) => {
            const teacher = await Teacher.findOne({_id: teacherId});
            return (await Post.find({teacherId}))
                .map(function(post,_) {
                    return {
                        teacher,
                        ...post,
                    };
                });
        },

        requestsForTeacher: async (_,{teacherId}) => {
            return await PostRequest.find({teacherId});
        },

        requestsForPost: async (_,{postId}) => {
            let teacherIds = {};
            let requests = await PostRequest.find({postId});
            for (let i=0;i<requests.length;i+=1) {
                let id = requests[i].teacherId;
                if (!teacherIds[id]) {
                    teacherIds[id] = await Teacher.findOne({_id: id});
                }
                requests[i] = {
                    teacher: teacherIds[id],
                    ...requests[i]._doc,
                };
            }

            return requests;
        },

        postItem: async (_,{itemName}) => {
            return await Post.find({itemName});
        },

        post: async (_,{_id}) => {
            const post = await Post.findOne({_id});
            const id = post.teacherId;

            const teacher = await Teacher.findOne({_id: id});

            const ret = {
                teacher,
                ...post._doc,
            };

            return ret;
        },

        request: async (_,{_id}) => {
            return await PostRequest.findOne({_id});
        },
    },
    Mutation: {
        createTeacher: async (_,args) => {
            const teacher = await Teacher.create(args);
            const token = signToken(teacher);

            return {token,user:teacher};
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

            return {token,user:teacher};
        },

        createPost: async (_,{token,itemName,itemQuantity,category}) => {
            const teacher = await authenticateUser(token);

            const post = await Post.create({
                teacherId: teacher._id,
                itemName,
                itemQuantity,
                category,
            });

            const ret = {
                teacher,
                ...post._doc,
            };

            return ret;
        },

        applyForSupply: async (_,{token,postId,count}) => {
            const teacher = await authenticateUser(token);
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
            const teacher = await authenticateUser(token);

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
            const teacher = await authenticateUser(token);

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
            const teacher = await authenticateUser(token);

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
            const teacher = await authenticateUser(token);

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
            const teacher = await authenticateUser(token);

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


async function authenticateUser(token) {
    const teacher = verifyToken(token);

    if (await Teacher.exists(teacher)) {
        return teacher;
    }

    throw new AuthenticationError("Invalid token");
}


module.exports = resolvers;
