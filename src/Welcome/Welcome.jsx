import React, { useState } from "react"
import {
    Input, Text, Center, HStack, VStack, Button,
    IconButton, FormControl, FormErrorMessage
} from "@chakra-ui/react"
import { InfoIcon, QuestionOutlineIcon } from "@chakra-ui/icons"

const Welcome = (props) => {
    const { setMyChannelId, compareWithChannelId } = props;
    const CHANNEL_URL = "https://www.googleapis.com/youtube/v3/channels";
    const API_KEY = "AIzaSyB5RlcImqTfN3dexuvMMtheYCuTPWUUQFQ";

    const [inputValue, setInputValue] = useState("");
    const [isValidId, setIsValidId] = useState(true);

    const checkValidId = () => {
        // first check if channel id is valid
        fetch(`${CHANNEL_URL}?key=${API_KEY}&id=${inputValue}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                // console.log('items' in data)
                setIsValidId('items' in data)
                if ('items' in data) {
                    submitChannelId();
                }
            });
    }

    const submitChannelId = () => {
        const newUrl = new URL(window.location.origin + '/do-we-youtube-the-same');
        newUrl.searchParams.append('myChannelId', inputValue);
        if (compareWithChannelId) {
            newUrl.searchParams.append('compareWith', compareWithChannelId);
        }
        window.history.replaceState(
            null,
            "User channel id added",
            newUrl.toString(),
        );
        setMyChannelId(inputValue);

    }


    return (
        <Center justifyContent="center" w="100vw" h="100vh">
            <VStack>
                <HStack>
                    <Text> Enter your</Text>
                    <Text as="b" color="#e9b666" >Youtube Channel ID </Text>
                    <IconButton variant="link" aria-label="channel-id-info"
                        onClick={() => window.open('https://support.google.com/youtube/answer/3250431?hl=en', '_blank')}
                        icon={<InfoIcon color="#e9b666" />} />
                </HStack>
                <FormControl isInvalid={!isValidId}>
                    <Input placeholder="Channel ID" value={inputValue}
                        onChange={e => {
                            setIsValidId(true);
                            setInputValue(e.target.value)
                        }} />
                    {!isValidId && <FormErrorMessage> Invalid channel ID provided.</FormErrorMessage>}

                </FormControl>
                <Button disabled={!inputValue} color="#0f4c81" onClick={() => checkValidId()}>Start comparing!</Button>
                <HStack fontSize="xs">
                    <Text as="i" >Make sure your subscriptions are public.</Text>
                    <IconButton variant="link" aria-label="public-subscription-info"
                        onClick={() => window.open('https://support.google.com/youtube/answer/7280190?hl=en', '_blank')}
                        icon={<QuestionOutlineIcon boxSize={4} />} />
                </HStack>
            </VStack>
        </Center >)


}

export default Welcome