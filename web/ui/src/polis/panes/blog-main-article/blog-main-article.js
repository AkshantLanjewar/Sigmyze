import React from 'react'

import { 
    Box,
    Paper,
    Grid,
    Badge,
    Title,
    Group,
    Text,
    Image,
    useMantineTheme 
} from '@mantine/core'

import useStyles from './blog-main-article.styles'

const BlogMainArticle = ({ article, polisId }) => {
    const { classes } = useStyles()
    const theme       = useMantineTheme()
    let options       = { month: 'short', day: 'numeric', year: 'numeric' }

    let title    = null
    let subtitle = null
    let date     = null
    let image    = null

    if(article !== null) {
        title    = article.published_title
        subtitle = article.published_subtitle
        date     = new Date(article.published_date)

        if('published_image' in article)
            image = article['published_image']
    }

    function Redirect() {
        if(polisId === null || polisId === undefined)
            return

        let layoutId         = 'published'
        let articleId        = article.published_id
        window.location.href = `/polis/${polisId}/${layoutId}/${articleId}`
    }

    return (
        <Box>
            {article == null
                ? null
                : (
                    <Box>
                        <Group 
                            className={classes.mainArticleContainer} 
                            pb="xl"
                        >
                            <Paper
                                shadow={"lg"}
                                p={0}
                                onClick={() => { Redirect() }}
                                sx={{ 
                                    width: 600, 
                                    background: theme.colors.dark[8],
                                    cursor: 'pointer' 
                                }}
                            >
                                <Grid sx={{ gap: 0, margin: 0 }}>
                                    <Grid.Col span={6} p={0}>
                                        <Image
                                            src={image}
                                            withPlaceholder
                                            height={234}
                                            width={300}
                                            fit={'fill'}
                                            radius={"sm"}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={6} p={"lg"}>
                                        <Box p={"md"}>
                                            <Badge 
                                                color={"teal"} 
                                                radius={"sm"} 
                                                variant={"outline"}
                                                mb={"md"}
                                            >
                                                    Blog
                                            </Badge>

                                            <Title order={3} mb={"xs"}>
                                                {title}
                                            </Title>

                                            <Text sx={{ fontSize: 14 }}>
                                                {subtitle}
                                            </Text>

                                            <Group mt={"lg"}>
                                                <Text size={"xs"} color={"dimmed"}>{date.toLocaleDateString("en-US", options)}</Text>
                                            </Group>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Paper>
                        </Group>
                    </Box>
                )
            }
        </Box>
    )
}

export default BlogMainArticle