import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    Button,
    Heading,
    Center,
    FormControl,
    FormLabel,
    Input,
    Text,
    useToast,
} from "@chakra-ui/react";
import {CREATE_POST} from "../utils/mutations";

import Auth from "../utils/auth";

export default () => {
    const [formState, setFormState] = useState({itemName: "", itemQuantity: 0});
    const [createPost, {error}] = useMutation(CREATE_POST);

    // update state based on form input changes
    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const toast = useToast();

    // submit form
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(Auth.getToken());
            await createPost({
                variables: {
                    itemName: formState.itemName,
                    itemQuantity: Number(formState.itemQuantity),
                    token:Auth.getToken(),
                },
            });

            toast({
                title: "Post created",
                status: "success",
                duration: 2500,
                isClosable: true,
            });

            // clear form values
            setFormState({
                itemName: "",
                itemQuantity: 0,
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Center marginTop="3ch">
            <Card align="center">
                <CardHeader>
                    <Heading as="h2" size="lg">Create a supply listing</Heading>
                </CardHeader>
                {error && (
                    <CardBody>
                        <Text>
                            {error.message}
                        </Text>
                    </CardBody>
                )}
                <CardFooter>
                    <FormControl as="form" onSubmit={handleFormSubmit}>
                        <FormLabel>Item name</FormLabel>
                        <Input type="text" name="itemName" value={formState.itemName} onChange={handleChange} />
                        <FormLabel>Quantity</FormLabel>
                        <Input type="number" name="itemQuantity" value={formState.itemQuantity} onChange={handleChange} />
                        <Button as="button" type="submit">Submit</Button>
                    </FormControl>
                </CardFooter>
            </Card>
        </Center>
    );
};
