import { useQuery } from "@apollo/client";
import {
    Card,
    CardHeader,
    CardBody,
    Heading,
    Text,
    Flex,
    Wrap,
    WrapItem,
    Spinner,
    Spacer,
} from "@chakra-ui/react";
import {POSTS} from "../utils/queries";

export default () => {
    const {loading, error, data} = useQuery(POSTS, {variables: {page: 0}});

    if (error) {
        return (<Text>Error: {error.message}</Text>);
    }
    if (loading) {
        return (<Spinner />);
    }

    console.log(data);

    return (
        <Flex alignItems="center" flexDirection="column">
            <Heading>Supply listings</Heading>
            <Spacer minHeight="3ch" />
            <Wrap justify="center" align="top">
                {data.allPosts.map(function(data,_) {
                    console.log(data);
                    const createdAt = new Date(Number(data.createdAt));
                    const teacher = data.teacher;

                    return (<WrapItem><Card>
                        <CardHeader><Heading size="lg">{data.itemQuantity} {data.itemName}</Heading></CardHeader>
                        <CardBody>
                            <Text>Posted by {teacher.first} {teacher.last} ({teacher.username}) of {teacher.school}</Text>
                            <Text>Created on {createdAt.toLocaleDateString()}</Text>
                        </CardBody>
                    </Card></WrapItem>);
                })}
            </Wrap>
        </Flex>
    );
};
