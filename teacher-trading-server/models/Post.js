const { Schema, model } = require('mongoose');

const postSchema = new Schema(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        itemName: {
            type: String,
            required: true,
            maxlength: 100,
            minlength: 2,
            default: 'Unnamed item',
            trim: true,
        },
        itemQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        requests: [{
            type: Schema.Types.ObjectId,
            ref: "PostRequest",
        }],
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

const Post = model('Post', postSchema);

module.exports = Post;
