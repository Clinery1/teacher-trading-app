import React from 'react';
import {
    ChakraProvider,
    Box,
    Text,
    Link,
    VStack,
    Code,
    Grid,
    theme,
} from '@chakra-ui/react';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
} from '@apollo/client';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';


const apollo_client = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache(),
});


function App() {
    return (
        <ApolloProvider client={apollo_client}>
            <ChakraProvider theme={theme}>
                <Box textAlign="center" fontSize="xl">
                    <Grid minH="100vh" p={3}>
                        <ColorModeSwitcher justifySelf="flex-end" />
                        <VStack spacing={8}>
                            <Logo h="40vmin" pointerEvents="none" />
                            <Text>
                                Edit <Code fontSize="xl">src/App.js</Code> and save to reload.
                            </Text>
                            <Link
                                color="teal.500"
                                href="https://chakra-ui.com"
                                fontSize="2xl"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Learn Chakra
                            </Link>
                        </VStack>
                    </Grid>
                </Box>
            </ChakraProvider>
        </ApolloProvider>
    );
}

export default App;
