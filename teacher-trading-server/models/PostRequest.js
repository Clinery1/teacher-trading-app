const { Schema, model } = require('mongoose');

const postRequestSchema = new Schema(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Teacher",
        },
        postId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Post",
        },
        count: {
            type: Number,
            required: true,
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

const PostRequest = model('PostRequest', postRequestSchema);

module.exports = PostRequest;
