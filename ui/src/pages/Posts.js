import {useState} from "react";
import {useQuery} from "@apollo/client";
import {Link as ReactLink} from "react-router-dom";
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
    LinkBox,
    LinkOverlay,
    Select,
} from "@chakra-ui/react";
import {POSTS} from "../utils/queries";
import PostCategories from "../components/PostCategories";

export default () => {
    const [formState, setFormState] = useState({category: "any"});
    const {loading, error, data, refetch} = useQuery(POSTS, {variables: {page: 0}});

    const handleChange = async (event) => {
        const {value} = event.target;

        setFormState({
            category: value,
        });

        let query = {page: 0};

        if (value!=="any") {
            query.category = value;
        }

        console.log(query);

        await refetch(query);
    };

    if (error) {
        return (<Text>Error: {error.message}</Text>);
    }
    if (loading) {
        return (<Spinner />);
    }

    return (
        <Flex alignItems="center" flexDirection="column">
            {data.allPosts.length===0 ? (
                <Heading>No listings</Heading>
            ):(<>
                <Heading>Supply listings</Heading>
                <Spacer minHeight="3ch" />
                <Heading>Filter by category</Heading>
                <Spacer minHeight="1ch" />
                <Select name="category" value={formState.category} onChange={handleChange}>
                    <option value="any">Any</option>
                    <PostCategories />
                </Select>
                <Spacer minHeight="3ch" />
                <Wrap justify="center" align="top">
                    {data.allPosts.map(function(data,_) {
                        const createdAt = new Date(Number(data.createdAt));
                        const teacher = data.teacher;
                        const navPoint = "/listing/"+data._id;

                        return (<WrapItem><LinkBox><Card>
                            <CardHeader><Heading size="lg"><LinkOverlay as={ReactLink} to={navPoint}>{data.itemQuantity} {data.itemName}</LinkOverlay></Heading></CardHeader>
                            <CardBody>
                                <Text>Posted by {teacher.first} {teacher.last} ({teacher.username}) of {teacher.school}</Text>
                                <Text>Created on {createdAt.toLocaleDateString()}</Text>
                            </CardBody>
                        </Card></LinkBox></WrapItem>);
                    })}
                </Wrap>
            </>)}
        </Flex>
    );
};
