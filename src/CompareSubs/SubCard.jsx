import { Box, Flex, Avatar, Text, Badge, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react"

const SubCard = (props) => {
    const { title, id, image, mine = true, match, share = false } = props;
    const [bgColor, setBgColor] = useState("#c3e4fd");
    const [hoverColor, setHoverColor] = useState("#c3e4fd");

    const toast = useToast()

    useEffect(() => {
        let newBgColor = match ? "#b5ba7e" : mine ? "#c3e4fd" : "#f4afb3";
        setBgColor(newBgColor);

        let newHoverColor = match ? "#90b5ba7e" : mine ? "#90c3e4fd" : "#90f4afb3";
        setHoverColor(newHoverColor);
    }, [id, match, mine])


    const handleClick = () => {
        if (share) {
            navigator.clipboard.writeText(window.location.origin + '/?compareWith=' + id)
            toast({
                title: 'Link copied to clipboard.',
                description: "Share to your friends :)",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } else {
            window.open(`https://youtube.com/channel/${id}`, '_blank')
        }
    }

    return (
        <Flex onClick={() => handleClick()}
            as="button" w="100%" bgColor={bgColor} borderWidth='1px' borderRadius='lg' p="3"
            _hover={{
                bgColor: hoverColor,
            }}>
            <Avatar src={image} />
            <Box ml='3'>
                <Text fontWeight='bold'>
                    {title}
                </Text>
            </Box>
        </Flex >
    )

}

export default SubCard