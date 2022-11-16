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

const ListArticle = ({ }) => {
    const { classes } = useStyles()

    return (
        <Card
            withBorder
            radius={"md"}
            p={0}
            className={classes.card}
        >
            <Group noWrap spacing={0}>
                <Image
                    src={null}
                    height={140}
                    width={140}
                    withPlaceholder
                />

                <Box className={classes.body}>
                    <Text transform="uppercase" color="dimmed" weight={700} size="xs">
                        Blog Post
                    </Text>

                    <Text className={classes.title} mt="xs" mb="md">
                        Article Title
                    </Text>

                    <Group noWrap spacing={"xs"}>
                        <Group spacing={"xs"} noWrap>
                            <Avatar 
                                size={22.5} 
                                src={null}
                                color={'blue'}
                            >
                                AL
                            </Avatar>
                            <Text size="xs">Author Name</Text>
                        </Group>

                        <Text size="xs" color="dimmed">•</Text>
                        <Text size="xs" color="dimmed">Feb 6th</Text>
                    </Group>
                </Box>
            </Group>
        </Card>
    )
}

export default ListArticle