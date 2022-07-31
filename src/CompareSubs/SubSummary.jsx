import React from "react"
import { Flex, CircularProgress, Text, VStack, CircularProgressLabel, IconButton, HStack, useToast } from '@chakra-ui/react'
import { CopyIcon } from "@chakra-ui/icons";

const SubSummary = (props) => {
    const { same, distinct, myChannelId, compareWithChannelId, noComparison } = props;
    const percentage = Math.round((same / (same + distinct)) * 100);

    const toast = useToast()

    const getShareLink = () => {
        const url = `${window.location.origin}/?compareWith=${noComparison ? myChannelId : compareWithChannelId}${noComparison ? "" : `&myChannelId=${myChannelId}`}`;
        console.log('url', url)
        navigator.clipboard.writeText(url);
        toast({
            title: 'Link copied to clipboard.',
            description: "Share to your friends :)",
            status: 'success',
            duration: 9000,
            isClosable: true,
        })
    }

    return (

        <Flex gap="10">
            <CircularProgress value={percentage} size='120px' color="#b5ba7e" >
                <CircularProgressLabel>{percentage}%</CircularProgressLabel>
            </CircularProgress >
            <VStack justifyContent="center" alignItems='flex-start'>
                <Text><strong>{same}</strong> matched subscriptions!</Text>
                <Text><strong>{distinct}</strong> distinct subscriptions!</Text>
                <HStack>
                    <Text>{noComparison ? "Share your link with friends to compare!" : "Share your results with a friend!"}</Text>
                    <IconButton aria-label='Search database' variant='link' icon={<CopyIcon />}
                        onClick={() => getShareLink()} />
                </HStack>

            </VStack>
        </Flex >
    )

}

export default SubSummary