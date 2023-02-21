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
    Select,
    Spacer,
    useToast,
} from "@chakra-ui/react";

import {CREATE_POST} from "../utils/mutations";
import PostCategories from "../components/PostCategories";
import Auth from "../utils/auth";

export default () => {
    const [formState, setFormState] = useState({itemName: "", itemQuantity: "", category: ""});
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

        if (formState.itemName==="") {
            toast({
                title: "Please input a name",
                status: "error",
                duration: 2500,
                isClosable: true,
            });
            return;
        }

        if (formState.itemQuantity==="") {
            toast({
                title: "Please input a quantity",
                status: "error",
                duration: 2500,
                isClosable: true,
            });
            return;
        }

        if (formState.category==="") {
            toast({
                title: "Please select a category",
                status: "error",
                duration: 2500,
                isClosable: true,
            });
            return;
        }

        try {
            console.log(Auth.getToken());
            await createPost({
                variables: {
                    itemName: formState.itemName,
                    itemQuantity: Number(formState.itemQuantity),
                    category: formState.category,
                    token: Auth.getToken(),
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
                itemQuantity: "",
                category: "",
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
                        <Spacer minHeight="1ch" />
                        <FormLabel>Quantity</FormLabel>
                        <Input type="number" name="itemQuantity" value={formState.itemQuantity} onChange={handleChange} />
                        <Spacer minHeight="2ch" />
                        <Select placeholder="Select a category" name="category" value={formState.category} onChange={handleChange}>
                            <PostCategories />
                        </Select>
                        <Spacer minHeight="2ch" />
                        <Button as="button" type="submit">Submit</Button>
                    </FormControl>
                </CardFooter>
            </Card>
        </Center>
    );
};
