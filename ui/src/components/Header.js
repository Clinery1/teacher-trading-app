import React from "react";
import {Link as ReactLink} from "react-router-dom";
import {
    Text,
    Flex,
    VStack,
    Spacer,
    ButtonGroup,
    Button,
    Heading,
    Center,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    useBreakpointValue,
} from "@chakra-ui/react";
import Auth from "../utils/auth";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { FaBars } from 'react-icons/fa';


export default () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const getButtons = () => {
        return (<>
            <Button width="min-content" onClick={onClose} as={ReactLink} to="/listings">
                Listings
            </Button>
            {Auth.loggedIn() ? (
                <>
                    <Button width="min-content" onClick={onClose} as={ReactLink} to="/create_post">
                        Create supply post
                    </Button>
                    <Button width="min-content" as={ReactLink} onClick={function(){Auth.logout();onClose()}}>
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Button width="min-content" onClick={onClose} as={ReactLink} to="/login">
                        Login
                    </Button>
                    <Button width="min-content" onClick={onClose} as={ReactLink} to="/signup">
                        Signup
                    </Button>
                </>
            )}
        </>);
    };
    return (
        <Flex alignItems="center" as="header" padding="1em">
            <Button paddingTop="2ch" paddingBottom="2ch" variant="ghost" as={ReactLink} to="/">
                <Heading>Teacher's Supply Trade</Heading>
            </Button>
            <Spacer minWidth="1ch" />
            {useBreakpointValue({base: true, sm: true, md: true, lg: false, xl: false}) ? (
                <>
                    <Button variant="ghost" onClick={onOpen}><FaBars /></Button>
                    <Drawer isOpen={isOpen} onClose={onClose} size="full">
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                            <ColorModeSwitcher width="min-content" />
                            {Auth.loggedIn() ? (<DrawerHeader>
                                <Text>Logged in as {Auth.getProfile().username}</Text>
                            </DrawerHeader>):<></>}
                            <DrawerBody>
                                <VStack alignItems="center">
                                    {getButtons()}
                                </VStack>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </>
            ) : (
                <>
                    {Auth.loggedIn() ? (<Center>
                        <Text>Logged in as {Auth.getProfile().username}</Text>
                    </Center>):<></>}
                    <Spacer />
                    <ButtonGroup isAttached variant="outline">
                        {getButtons()}
                    </ButtonGroup>
                    <ColorModeSwitcher justifySelf="flex-end" />
                </>
            )}
        </Flex>
    );
};
