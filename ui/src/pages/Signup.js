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
} from "@chakra-ui/react";
import {ADD_TEACHER} from "../utils/mutations";

import Auth from "../utils/auth";

export default () => {
    const [formState, setFormState] = useState({username: "", first: "", last: "", school: "", password: ""});
    const [signup, {error}] = useMutation(ADD_TEACHER);

    // update state based on form input changes
    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    // submit form
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const {data} = await signup({
                variables: {...formState},
            });

            Auth.login(data.createTeacher.token);
            window.location.pathname="/";
        } catch (e) {
            console.error(e);
        }

        // clear form values
        setFormState({
            username: "",
            first: "",
            last: "",
            school: "",
            password: "",
        });
    };

    return (
        <Center marginTop="3ch">
            <Card align="center">
                <CardHeader>
                    <Heading as="h2" size="lg">Signup</Heading>
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
                        <FormLabel>Username</FormLabel>
                        <Input type="text" name="username" value={formState.username} onChange={handleChange} />
                        <FormLabel>First name</FormLabel>
                        <Input type="text" name="first" value={formState.first} onChange={handleChange} />
                        <FormLabel>Last name</FormLabel>
                        <Input type="text" name="last" value={formState.last} onChange={handleChange} />
                        <FormLabel>School name</FormLabel>
                        <Input type="text" name="school" value={formState.school} onChange={handleChange} />
                        <FormLabel>Password</FormLabel>
                        <Input type="password" name="password" value={formState.password} onChange={handleChange} />
                        <Button as="button" type="submit">Submit</Button>
                    </FormControl>
                </CardFooter>
            </Card>
        </Center>
    );
};
