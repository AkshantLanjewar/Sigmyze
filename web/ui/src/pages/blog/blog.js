import React     from 'react'
import Dots      from './dots'
import useStyles from './blog.styles'

import { 
    Container,
    Title,
    Text,
    Group,
    useMantineTheme 
} from '@mantine/core'

import TestImage   from '../../assets/test-image.jpg'
import MainArticle from './sub-components/main-article'
import Article     from './sub-components/article'

function Blog() {
    const { classes } = useStyles()
    const theme       = useMantineTheme()

    return (
        <div>
            <div className={classes.background}>
                <Container className={classes.wrapper} size={1400}>
                    <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
                    <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
                    <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
                    <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

                    <div className={classes.inner}>
                        <Title className={classes.title}>
                            Sigmyze {' '}
                            <Text component='span' color={theme.primaryColor} inherit>
                                News Feed
                            </Text>
                        </Title>

                        <Container p={0} size={600}>
                            <Text size={"lg"} color={"dimmed"} className={classes.description}>
                                Get all the latest platform news, whether it is a new feature we are launching, planning, or simply just a new usecase we found
                            </Text>
                        </Container>
                    </div>
                </Container>
            </div>

            <div>
                <MainArticle image={TestImage} />

                <Group mt={"xl"} mb={"xl"} pt={"xl"} position={"center"} spacing={"lg"}>
                    <Article image={TestImage} />
                    <Article image={TestImage} />
                    <Article image={TestImage} />
                </Group>
            </div>
        </div>
    )
}

export default Blog