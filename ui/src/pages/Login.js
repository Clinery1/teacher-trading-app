import {useState} from "react";
import {useMutation} from "@apollo/client";
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
import {LOGIN_TEACHER} from "../utils/mutations";

import Auth from "../utils/auth";

export default () => {
    const [formState, setFormState] = useState({username: "", password: ""});
    const [login, {error}] = useMutation(LOGIN_TEACHER);

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
            const {data} = await login({
                variables: {...formState},
            });

            Auth.login(data.login.token);
            window.location.pathname="/";
        } catch (e) {
            console.error(e);
        }

        // clear form values
        setFormState({
            username: "",
            password: "",
        });
    };

    return (
        <Center marginTop="3ch">
            <Card align="center">
                <CardHeader>
                    <Heading as="h2" size="lg">Login</Heading>
                </CardHeader>
                {error && (
                    <CardBody>
                        <Text color="tomato">
                            {error.message}
                        </Text>
                    </CardBody>
                )}
                <CardFooter>
                    <FormControl as="form" onSubmit={handleFormSubmit}>
                        <FormLabel>Username</FormLabel>
                        <Input type="text" name="username" value={formState.username} onChange={handleChange} />
                        <FormLabel>Password</FormLabel>
                        <Input type="password" name="password" value={formState.password} onChange={handleChange} />
                        <Button as="button" type="submit">Submit</Button>
                    </FormControl>
                </CardFooter>
            </Card>
        </Center>
    );
};
