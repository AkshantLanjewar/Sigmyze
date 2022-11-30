import React, { useState, useEffect } from 'react'

import { 
    Box,
    Card,
    Image,
    Badge,
    Text,
    Group,
    Avatar,
    ActionIcon,
    Tooltip,
    useMantineTheme 
} from '@mantine/core'

import useStyles from './blog-article-block.styles'

import { GenerateInitials }   from '../../../components/lib'
import { MdOutlineOpenInNew } from 'react-icons/md'

const BlogArticleBlockCard = ({ article, polisId }) => {
    const { classes } = useStyles()
    const theme       = useMantineTheme()
    let options       = { month: 'short', day: 'numeric', year: 'numeric' }

    //card components
    const [cardImage, setCardImage]         = useState(null)
    const [articleText, setArticleText]     = useState({
        title: 'Test title',
        subtitle: 'Subtitle'
    })
    const [articleAuthor, setArticleAuthor] = useState({
        author: 'Author',
        date: new Date()
    })

    useEffect(() => {
        if(article == null || article == undefined)
            return

        let author = article['public_user']['username']
        let date   = new Date(article['published_date'])
        let title  = article['published_title']
        let subt   = article['published_subtitle']
        let image  = null
        
        if('published_image' in article)
            image = article['published_image']

        setCardImage(image)
        setArticleText({
            title: title,
            subtitle: subt
        })
        setArticleAuthor({
            author: author,
            date: date
        })
    }, [article])

    function Redirect() {
        if(polisId === null || polisId === undefined)
            return

        let layoutId         = 'published'
        let articleId        = article.published_id
        window.location.href = `/polis/${polisId}/${layoutId}/${articleId}`
    } 

    return (
        <Box>
            <Card
                p={"lg"}
                radius={"sm"}
                shadow={'md'}
                className={classes.articleCard}
                sx={{ overflow: 'visible' }}
            >
                <Card.Section mb={"sm"}>
                    <Image
                        src={cardImage}
                        withPlaceholder
                        height={180}
                        fit={'fill'}
                    />
                </Card.Section>

                <Badge 
                    color={"teal"} 
                    radius={"sm"} 
                    variant={"outline"}
                >
                    Blog
                </Badge>

                <Text
                    weight={700}
                    mt={"xs"}
                    className={classes.articleTitle}
                >
                    {articleText.title}
                </Text>

                <Text
                    className={classes.articleSubtitle}
                >
                    {articleText.subtitle}
                </Text>

                <Group mt={"lg"} mb={'sm'}>
                    <Avatar
                        color={"gray"}
                        radius={"sm"}
                        src={null}
                    >
                        {GenerateInitials(articleAuthor.author)}
                    </Avatar>

                    <Box>
                        <Text weight={500}>{articleAuthor.author}</Text>
                        <Text size={"xs"} color={"dimmed"}>
                            Posted {articleAuthor.date.toLocaleDateString("en-US", options)}
                        </Text>
                    </Box>
                </Group>

                <Card.Section withBorder>
                    <Group 
                        spacing={5} 
                        position={'right'}
                        mt={'xs'}
                        mb={'xs'}
                        mx={'sm'}
                    >
                        <Tooltip
                            withArrow
                            label={"Open Blog"}
                            position={'right'}
                        >
                            <ActionIcon 
                                color={"gray"} 
                                variant={'light'}
                                radius={'sm'}
                                onClick={() => { Redirect() }}
                            >
                                <MdOutlineOpenInNew />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Card.Section>
            </Card>
        </Box>
    )
}

export default BlogArticleBlockCard