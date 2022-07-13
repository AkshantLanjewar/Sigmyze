import React from "react"

import useStyles from "../blog.styles"
import {
    useMantineTheme,
    Title,
    Text,
    Group,
    Paper,
    Grid,
    Badge,
} from '@mantine/core'

function MainArticle({ image }) {
    const { classes } = useStyles()
    const theme       = useMantineTheme()

    return (
        <div>
            <Group className={classes.mainArticleContainer} pb={"xl"}>
                <Paper shadow={"lg"} p={0} sx={{ width: 800, background: theme.colors.dark[8] }}>
                    <Grid sx={{ gap: 0, margin: 0 }}>
                        <Grid.Col span={6} p={0}>
                            <img 
                                src={image} 
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: 'cover'
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} p={"lg"}>
                            <div style={{ padding: theme.spacing.md }}>
                                <Badge 
                                    color={"teal"} 
                                    radius={"sm"} 
                                    variant={"outline"}
                                    mb={"md"}
                                >
                                        Dev Update
                                </Badge>

                                <Title order={3} mb={"xs"}>
                                    Some cool new feature that we are introducing
                                </Title>

                                <Text sx={{ fontSize: 14 }}>
                                    We talk about this cool new feature that we are introducing.
                                    It is super cool and awseome.
                                </Text>

                                <Group mt={"lg"}>
                                    <Text size={"xs"} color={"dimmed"}>July 12, 2022</Text>
                                </Group>
                            </div>
                        </Grid.Col>
                    </Grid>
                </Paper>
            </Group>
        </div>
    )
}

export default MainArticle