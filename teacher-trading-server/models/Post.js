const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        itemName: {
            type: String,
            required: true,
            maxLength: 100,
            minLength: 2,
            default: "Unnamed item",
            trim: true,
        },
        itemQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
            maxLength: 50,
            minLength: 2,
            default: "other",
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

const Post = model("Post", postSchema);

module.exports = Post;
