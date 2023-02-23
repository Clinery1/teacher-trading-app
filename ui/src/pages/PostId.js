import {useState} from "react";
import {useQuery, useMutation} from "@apollo/client";
import {useParams} from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Heading,
    Text,
    Flex,
    HStack,
    Spacer,
    Wrap,
    WrapItem,
    Spinner,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Portal,
    FormControl,
    FormLabel,
    Input,
    useToast,
} from "@chakra-ui/react";
import Auth from "../utils/auth";
import {FaQuestionCircle, FaCheckCircle, FaMinusCircle} from 'react-icons/fa';
import {POST, REQUESTS_FOR_POST} from "../utils/queries";
import {ACCEPT_REQUEST, DENY_REQUEST, REMOVE_REQUEST, CREATE_REQUEST} from "../utils/mutations";


export default () => {
    const [formState, setFormState] = useState({count: "", shouldReload: false});

    const id = useParams().postId;
    const {loading, error, data, refetch} = useQuery(POST, {variables: {id}});
    const {loading: requestsLoading, error: requestsError, data: requestsData, refetch: refetchRequests} = useQuery(REQUESTS_FOR_POST, {variables: {id}});

    const [createRequest] = useMutation(CREATE_REQUEST);
    const [acceptRequestMutation, {error: acceptRequestError}] = useMutation(ACCEPT_REQUEST);
    const [denyRequestMutation, {error: denyRequestError}] = useMutation(DENY_REQUEST);
    const [removeRequestMutation, {error: removeRequestError}] = useMutation(REMOVE_REQUEST);

    const toast = useToast();

    const acceptRequest = async (requestId) => {
        try {
            await acceptRequestMutation({
                variables: {
                    requestId,
                    token: Auth.getToken(),
                },
            });

            toast({
                title: "Request accepted",
                status: "info",
                duration: 2500,
                isClosable: true,
            });

            refetch();
            refetchRequests();
        } catch (e) {
            console.error(e,acceptRequestError);
        }
    };

    const denyRequest = async (requestId) => {
        try {
            await denyRequestMutation({
                variables: {
                    requestId,
                    token: Auth.getToken(),
                },
            });

            toast({
                title: "Request denied",
                status: "info",
                duration: 2500,
                isClosable: true,
            });

            refetchRequests();
        } catch (e) {
            console.error(e,denyRequestError);
        }
    };

    const removeRequest = async (requestId) => {
        try {
            await removeRequestMutation({
                variables: {
                    requestId,
                    token: Auth.getToken(),
                },
            });

            toast({
                title: "Request removed",
                status: "info",
                duration: 2500,
                isClosable: true,
            });

            refetchRequests();
        } catch (e) {
            console.error(e,removeRequestError);
        }
    };

    // update state based on form input changes
    const handleChange = (event) => {
        const {value} = event.target;

        setFormState({
            ...formState,
            count: value,
        });
    };

    // submit form
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (formState.count==="") {
            toast({
                title: "Please input how many items you want",
                status: "error",
                duration: 2500,
                isClosable: true,
            });
            return;
        }

        try {
            const count = Number(formState.count);

            if (formState.count>data.post.itemQuantity) {
                toast({
                    title: "Cannot request more than the supply",
                    status: "error",
                    duration: 2500,
                    isClosable: true,
                });

                return;
            }

            await createRequest({
                variables: {
                    token: Auth.getToken(),
                    postId: id,
                    count,
                },
            });

            toast({
                title: "Request submitted.",
                status: "success",
                duration: 2500,
                isClosable: true,
            });

            refetchRequests();

            setFormState({
                ...formState,
                count: "",
            });
        } catch (e) {
            console.error(e);
        }
    };

    if (error||requestsError) {
        return (<Text>Error: {error.message}</Text>);
    }
    if (loading||requestsLoading) {
        return (<Spinner />);
    }

    const createdAt = new Date(Number(data.post.createdAt));
    const teacher = data.post.teacher;

    let userId = "";
    if (Auth.loggedIn()) {
        userId = Auth.getProfile()._id;
    }

    let postOwner = teacher._id==userId;

    // console.log(data);
    // console.log(requestsData);

    return (
        <Flex flexDirection="column" alignItems="center" as="header" padding="1em">
            <Card>
                <CardHeader><Heading size="lg">{data.post.itemQuantity} {data.post.itemName}</Heading></CardHeader>
                <CardBody>
                    <Text>Posted by {teacher.first} {teacher.last} ({teacher.username}) of {teacher.school}</Text>
                    <Text>Created on {createdAt.toLocaleDateString()}</Text>
                </CardBody>
                {!postOwner&&Auth.loggedIn() ? (
                    <CardFooter>
                        <Flex flexDirection="column">
                            <Heading size="lg">Request supplies</Heading>
                            <Spacer minHeight="1ch" />
                            <FormControl as="form" onSubmit={handleFormSubmit}>
                                <FormLabel>Count</FormLabel>
                                <Input type="number" name="username" value={formState.username} onChange={handleChange} />
                                <Spacer minHeight="1ch" />
                                <Button as="button" type="submit">Submit</Button>
                            </FormControl>
                        </Flex>
                    </CardFooter>
                ):<></>}
            </Card>
            <Spacer minHeight="2ch" />
            <Heading>Requests</Heading>
            <Spacer minHeight="1ch" />
            <Wrap>
                {requestsData.requestsForPost.map(function(req) {
                    const teacher = req.teacher;
                    const requestOwner = teacher._id==Auth.getProfile()._id;

                    return (<WrapItem>
                        <Card>
                            <CardHeader>
                                <HStack>
                                    {req.reviewed ? (
                                        req.accepted ? (
                                            <FaCheckCircle size="4ch" color="green" />
                                        ):(
                                            <FaMinusCircle size="4ch" color="red" />
                                        )
                                    ):(
                                        <FaQuestionCircle size="4ch" color="teal" />
                                    )}
                                    <Text>{req.count}</Text>
                                </HStack>
                                <Spacer minHeight="1ch" />
                                <Text>{teacher.first} {teacher.last} at {teacher.school}</Text>
                            </CardHeader>
                            {postOwner&&!req.reviewed ? (
                                <CardBody>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button>Review</Button>
                                        </PopoverTrigger>
                                        <Portal>
                                            <PopoverContent>
                                                <PopoverArrow />
                                                <PopoverCloseButton />
                                                <PopoverHeader>
                                                    Accept/Deny the reqest
                                                </PopoverHeader>
                                                <PopoverBody>
                                                    <Button onClick={function() {
                                                        acceptRequest(req._id);
                                                    }}>
                                                        <FaCheckCircle size="4ch" color="green" />
                                                    </Button>
                                                    <Button onClick={function() {
                                                        denyRequest(req._id);
                                                    }}>
                                                        <FaMinusCircle size="4ch" color="red" />
                                                    </Button>
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Portal>
                                    </Popover>
                                </CardBody>
                            ):requestOwner ? (
                                <CardBody>
                                    <Button onClick={function() {
                                        removeRequest(req._id);
                                    }}>Remove request</Button>
                                </CardBody>
                            ):<></>}
                        </Card>
                    </WrapItem>);
                })}
            </Wrap>
        </Flex>
            // {Auth.loggedIn() ? (
            //     <Heading>Welcome {Auth.getProfile().first} {Auth.getProfile().last}</Heading>
            // ):(<>
            //     <Heading align="center">Welcome to Teacher's Supply Trade!</Heading>
            //     <Spacer minHeight="3ch" />
            //     <Text align="center">You should start by either making an account or logging in.</Text>
            //     <Spacer minHeight="1ch" />
            //     <Text align="center">You can also view all of the supply listings by pressing the "Listings" nav button</Text>
            // </>)}
    );
};
