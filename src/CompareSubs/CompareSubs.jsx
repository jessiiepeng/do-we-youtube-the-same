import React, { useEffect, useState } from "react"
import { Spinner, Text, HStack, VStack, Center, Flex, CircularProgress } from '@chakra-ui/react'

import SubCard from "./SubCard";
import axios from "axios";
import SubSummary from "./SubSummary";

const CompareSubs = (props) => {
    const { myChannelId, compareWithChannelId } = props;
    /**
     * Channel object format:
     * {
     *  title: Title of channel
     *  description: channel description
     *  id: channel id
     *  image: channel thumbnail,
     *  match: boolean if matches with compared channels,
     * }
     */
    const [myChannels, setMyChannels] = useState([]);
    const [compareChannels, setCompareChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myMatchedChannels, setMyMatchedChannels] = useState([]);
    const [myNonMatchedChannels, setMyNonMatchedChannels] = useState([]);
    const [friendNonMatchedChannels, setFriendNonMatchedChannels] = useState([]);

    const SUBSCRIPTION_URL = "https://www.googleapis.com/youtube/v3/subscriptions";
    const API_KEY = process.env.REACT_APP_API_KEY

    const fetchSubs = async (channelId, nextPageToken, subsArray, setLoadingFalse = false) => {
        const url = `${SUBSCRIPTION_URL}?key=${API_KEY}&part=snippet&channelId=${channelId}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;
        console.log('url', url)
        try {
            const result = await axios.get(url);
            result['data']['items'].forEach((d) => {
                subsArray.push({
                    'title': d['snippet'].title,
                    'description': d['snippet'].description,
                    'id': d['snippet']['resourceId'].channelId,
                    'image': d['snippet']['thumbnails']['default'].url,
                })
            })
            if ('nextPageToken' in result['data']) {
                return fetchSubs(channelId, result['data']['nextPageToken'], subsArray, setLoadingFalse);
            } else {
                console.log('final array', subsArray, 'set loading flase', setLoadingFalse)
                if (setLoadingFalse) {
                    setLoading(false);
                }
                return subsArray;
            }
        } catch (error) {
            console.log(error)
        }
    }

    /** Fetch my channel subscriptions */
    useEffect(() => {
        console.log('my channel fetching', myChannelId)
        fetchSubs(myChannelId, "", []).then(val =>
            setMyChannels(val));

    }, [myChannelId])

    /** Fetch my friend's subscriptions */
    useEffect(() => {
        console.log('compare friend chanenle fetching', compareWithChannelId)
        setLoading(true);
        if (compareWithChannelId) {
            console.log('here')
            fetchSubs(compareWithChannelId, "", [], true).then(val => {
                setCompareChannels(val)
            });
        } else {
            setLoading(false);
        }
    }, [compareWithChannelId])

    /** Sort subscriptions in alphabetical order by title and then update which ones match with each other */
    useEffect(() => {
        console.log('Finding same/distinct subscriptions and returning sorted results:')
        console.log('Before processing myChannels:', myChannels)
        console.log('Before processing: compareChannels', compareChannels)

        // get matched ids
        let matchedIds = [];
        if (compareWithChannelId && compareChannels.length > 0) {
            myChannels.forEach((channel) => {
                const i = compareChannels.findIndex(c => c.id === channel.id);
                if (i) {
                    matchedIds.push(channel.id)
                }
            })
            console.log('The matched ids:', matchedIds)

            let myMatched = myChannels.filter(channel => matchedIds.indexOf(channel.id));
            let myNonMatched = myChannels.filter((channel) => (matchedIds.indexOf(channel.id) === -1))
            let friendNonMatched = compareChannels.filter((channel) => (matchedIds.indexOf(channel.id) === -1))


            console.log('my matched', myMatched);
            console.log('my non matched', myNonMatched);
            console.log('friend non matched', friendNonMatched)

            setMyMatchedChannels(sortedChannels(myMatched))
            setMyNonMatchedChannels(sortedChannels(myNonMatched))
            setFriendNonMatchedChannels(sortedChannels(friendNonMatched))
        } else {
            setMyNonMatchedChannels(sortedChannels(myChannels))
        }
        console.log('matched ids', matchedIds)

        // get array of my non matched subscriptions


    }, [loading, myChannels, compareChannels, compareWithChannelId, myChannelId, compareWithChannelId])


    const sortedChannels = (channels) => {
        return channels.sort((a, b) => (a.title > b.title) ? 1 : -1);
    }


    return (
        <Center p={10} verticalAlign="top" w="100vw"> {loading ? <Spinner /> :
            <Flex flexDir="column">
                <Center>
                    <SubSummary same={myMatchedChannels.length}
                        distinct={myNonMatchedChannels.length + friendNonMatchedChannels.length}
                        myChannelId={myChannelId} compareWithChannelId={compareWithChannelId} noComparison={compareWithChannelId === ""} />
                </Center>
                <Flex padding="10" gap="10" flexDir="row" w="70vw">
                    <VStack w="50%">
                        <Text fontSize='2xl'> Your subscriptions:</Text>
                        {myMatchedChannels.map((c, i) => (
                            <SubCard key={i} title={c.title} image={c.image} match mine id={c.id} />
                        ))}
                        {myNonMatchedChannels.map((c, i) => (
                            <SubCard key={i} title={c.title} image={c.image} match={false} mine id={c.id} />
                        ))}
                    </VStack>
                    <VStack w="50%">
                        <Text fontSize='2xl'>Your friend's subscriptions: </Text>
                        {compareChannels.length > 0 ?
                            <>
                                {myMatchedChannels.map((c, i) => (
                                    <SubCard key={i} title={c.title} image={c.image} match={true} id={c.id} />
                                ))}
                                {friendNonMatchedChannels.map((c, i) => (
                                    <SubCard key={i} title={c.title} image={c.image} match={false} id={c.id} />
                                ))}
                            </>
                            :
                            <SubCard title="Share your link with friends to compare subscriptions!" image="" share id={myChannelId} />

                        }
                    </VStack>

                </Flex>
            </Flex>
        }
        </Center >

    )

}

export default CompareSubs;