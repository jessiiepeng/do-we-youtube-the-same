import React, { useEffect, useState } from "react";
import Welcome from '../Welcome/Welcome';
import CompareSubs from '../CompareSubs/CompareSubs'
import { Box } from "@chakra-ui/react"

const AppContainer = () => {
    const [myChannelId, setMyChannelId] = useState("");
    const [compareWithChannelId, setCompareWithChannelId] = useState("");

    /** Fetches params from url 
     *  myChannelId: string of current user's channel id
     *  compareWith: string of another user's channel id
    */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const myChannelIdParam = params.has('myChannelId')
            ? params.get('myChannelId') : ''
        const compareWithParam = params.has('compareWith')
            ? params.get('compareWith') : ''
        // console.log('my channel id', myChannelIdParam)
        // console.log('compare with', compareWithParam)
        setMyChannelId(myChannelIdParam);
        setCompareWithChannelId(compareWithParam);

    }, [])

    return (
        <Box w="100vm" h="100vh" >
            {myChannelId ?
                <CompareSubs myChannelId={myChannelId}
                    compareWithChannelId={compareWithChannelId} /> :
                <Welcome setMyChannelId={setMyChannelId}
                    compareWithChannelId={compareWithChannelId} />}
        </Box >
    );

}

export default AppContainer;