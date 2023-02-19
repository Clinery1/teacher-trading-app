const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2 days';

module.exports = {
    verifyToken: function (token) {
        return jwt.verify(token,secret);
    },
    signToken: function (payload) {
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};
