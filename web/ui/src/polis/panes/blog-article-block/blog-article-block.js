import React from 'react'

import { 
    Box,
    Group,
    Grid 
} from '@mantine/core'

import BlogArticleBlockCard from './blog-article-block-card'

const BlogArticleBlock = ({ articles, polisId }) => {
    return (
        <Box
            mt={"xl"}
            mb={"xl"} 
            pt={"xl"}
        >
            <Group position={'center'} spacing={'lg'}>
                <Grid
                    justify={"center"}
                    sx={{ width: '80%' }}
                >
                    {articles.map((step) => (
                        <Grid.Col span={3}>
                            <BlogArticleBlockCard 
                                article={step} 
                                polisId={polisId}
                            />
                        </Grid.Col>
                    ))}
                </Grid>
            </Group>
        </Box>
    )
} 

export default BlogArticleBlock