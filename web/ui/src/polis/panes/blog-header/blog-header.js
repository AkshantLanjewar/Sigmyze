import React   from "react"

import { 
    Box,
    Container,
    Title,
    Text,
    useMantineTheme 
} from "@mantine/core"

import Dots      from "../dots"
import useStyles from "./blog-header.styles"

const BlogHeader = ({ title, focusTitle, subtitle }) => {
    const { classes } = useStyles()
    const theme       = useMantineTheme()

    return (
        <Box className={classes.background}>
            <Container 
                size={1400}
                className={classes.wrapper}
            >
                <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
                <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
                <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
                <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

                <Box className={classes.inner}>
                    <Title className={classes.title}>
                        {title} {' '}

                        <Text 
                            component="span" 
                            color={theme.primaryColor} 
                            inherit
                        >
                            {focusTitle}
                        </Text>
                    </Title>

                    <Container p={0} size={600}>
                        <Text 
                            size={"lg"} 
                            color={"dimmed"} 
                            className={classes.description}
                        >
                            {subtitle}
                        </Text>
                    </Container>
                </Box>
            </Container>
        </Box>
    )
}

export default BlogHeader