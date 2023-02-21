import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import {
    ChakraProvider,
    Flex,
    extendTheme,
} from "@chakra-ui/react";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
} from "@apollo/client";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import PostId from "./pages/PostId";


export default () => {
    const apollo_client = new ApolloClient({
        uri: "/graphql",
        cache: new InMemoryCache(),
    });

    const config={
        initialColorMode: "dark",
    };

    const theme=extendTheme({config});

    return (
        <ApolloProvider client={apollo_client}>
            <ChakraProvider theme={theme}>
                <Router>
                    <Flex flexDirection="column">
                        <Header />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/listings" element={<Posts />} />
                            <Route path="/listing/:postId" element={<PostId />} />
                            <Route path="/create_post" element={<CreatePost />} />
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </Flex>
                </Router>
            </ChakraProvider>
        </ApolloProvider>
    );
};
