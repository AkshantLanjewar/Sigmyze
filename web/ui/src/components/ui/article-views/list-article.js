import React from 'react'

import { 
    Card,
    Group,
    Image,
    Box,
    Text,
    Avatar,
    createStyles 
} from '@mantine/core'

import { GenerateInitials } from '../../lib'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colors.dark[7],
        width: '100%'
    },

    body: {
        padding: theme.spacing.md,
    },

    title: {
        fontWeight: 700,
        lineHeight: 1.2
    }
}))

const ListArticle = ({ title, articleImage, author, date }) => {
    const { classes } = useStyles()
    let options       = { month: 'short', day: 'numeric', year: 'numeric' }

    return (
        <Card
            withBorder
            radius={"md"}
            p={0}
            className={classes.card}
        >
            <Group noWrap spacing={0}>
                <Image
                    src={articleImage}
                    height={140}
                    width={140}
                    withPlaceholder
                />

                <Box className={classes.body}>
                    <Text transform="uppercase" color="dimmed" weight={700} size="xs">
                        Blog Post
                    </Text>

                    <Text className={classes.title} mt="xs" mb="md">
                        { title == '' ? 'Article Title' : title }
                    </Text>

                    <Group noWrap spacing={"xs"}>
                        <Group spacing={"xs"} noWrap>
                            <Avatar 
                                size={22.5} 
                                src={null}
                                color={'blue'}
                            >
                                { GenerateInitials(author['name']) }
                            </Avatar>
                            <Text size="xs">{author['name']}</Text>
                        </Group>

                        <Text size="xs" color="dimmed">•</Text>
                        <Text size="xs" color="dimmed">
                            {date == null
                                ? null
                                : date.toLocaleDateString("en-US", options)
                            }
                        </Text>
                    </Group>
                </Box>
            </Group>
        </Card>
    )
}

export default ListArticle