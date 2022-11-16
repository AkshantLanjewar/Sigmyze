import React, { useState, useEffect } from 'react'

import { 
    Box,
    Title,
    Group,
    SegmentedControl,
    Center,
    ScrollArea 
} from '@mantine/core'

import { 
    TbList,
    TbNews 
} from 'react-icons/tb'

import ListArticle   from '../../../../components/ui/article-views/list-article'
import BannerArticle from '../../../../components/ui/article-views/banner-article'

const CardPreview = ({ }) => {
    const [value, setValue]   = useState('list')
    const [height, setHeight] = useState(null)
    const ref = React.createRef(null)

    useEffect(() => {
        setHeight(ref.current.clientHeight)
    }, [])

    return (
        <Box
            ref={ref}
            mt={"xl"}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}
        >
            <ScrollArea 
                sx={{ height: height !== null ? height : 'auto' }} 
                offsetScrollbars
            >
                <Group
                    position='apart'
                    align={'center'}
                >
                    <Title order={3}>Card Preview</Title>
                    
                    <SegmentedControl
                        value={value}
                        onChange={setValue}

                        data={[
                            {
                                value: 'list',
                                label: (
                                    <Center>
                                        <TbList size={16} />
                                        <Box ml={5}>List View</Box>
                                    </Center>
                                )
                            },
                            {
                                value: 'banner',
                                label: (
                                    <Center>
                                        <TbNews size={16} />
                                        <Box ml={5}>Banner View</Box>
                                    </Center>
                                )
                            }
                        ]}
                    />
                </Group>

                <Box
                    pt={'md'}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {value == 'list' && (
                        <ListArticle />
                    )}

                    {value == 'banner' && (
                        <BannerArticle />
                    )}
                </Box>          
            </ScrollArea>
        </Box>
    )
}

export default CardPreview