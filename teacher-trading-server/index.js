const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');


const db = require('./config/connection');
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const PORT = process.env.PORT || 3001;
const app = express();


async function main() {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../ui/build')));
    app.get(["/","/[a-z]+","/[a-z]+/[A-Za-z0-9]+"], (_, res) => {
        res.sendFile(path.join(__dirname, '../ui/build/index.html'));
    });

    // Create a new instance of an Apollo server with the GraphQL schema
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
}


main();
