const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Schema to create Teacher model
const teacherSchema = new Schema(
    {
        last_session_id: {
            type: String,
            default: () => "",
        },
        username: {
            type: String,
            required: true,
            max_length: 50,
            unique: true,
            trim: true,
        },
        first: {
            type: String,
            required: true,
            max_length: 50,
            trim: true,
        },
        last: {
            type: String,
            required: true,
            max_length: 50,
            trim: true,
        },
        school: {
            type: String,
            required: true,
            max_length: 100,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            min_length: 5,
        },
        supply_posts: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Post",
        }],
        requests: [{
            type: Schema.Types.ObjectId,
            ref: "PostRequest",
        }],
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

teacherSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

// compare the incoming password with the hashed password
teacherSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Teacher = model('Teacher', teacherSchema);

module.exports = Teacher;
