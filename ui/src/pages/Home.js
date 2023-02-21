import {
    Text,
    Flex,
    Spacer,
    Heading,
} from "@chakra-ui/react";
import Auth from "../utils/auth";


export default () => {
    return (
        <Flex flexDirection="column" alignItems="center" as="header" padding="1em">
            {Auth.loggedIn() ? (
                <Heading>Welcome {Auth.getProfile().first} {Auth.getProfile().last}</Heading>
            ):(<>
                <Heading align="center">Welcome to Teacher's Supply Trade!</Heading>
                <Spacer minHeight="3ch" />
                <Text align="center">You should start by either making an account or logging in.</Text>
                <Spacer minHeight="1ch" />
                <Text align="center">You can also view all of the supply listings by pressing the "Listings" nav button</Text>
            </>)}
        </Flex>
    );
};
