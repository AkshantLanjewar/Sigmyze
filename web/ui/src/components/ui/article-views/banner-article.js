import React from 'react'

import { 
    Box,
    Paper,
    Button,
    Text,
    Title,
    createStyles
} from '@mantine/core'

const useStyles = createStyles((theme) => ({
    card: {
        height: 440,
        width: 350,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },

    category: {
        color: theme.white,
        opacity: 0.7,
        fontWeight: 700,
        textTransform: 'uppercase'
    },

    title: {
        fontWeight: 900,
        color: theme.white,
        lineHeight: 1.2,
        fontSize: 32,
        marginTop: theme.spacing.xs
    }
}))

const BannerArticle = ({ }) => {
    const { classes } = useStyles()

    return (
        <Paper
            shadow={"md"}
            p={"xl"}
            radius={"md"}
            className={classes.card}
        >
            <Box>
                <Text className={classes.category} size={'xs'}>
                    Blog Post
                </Text>

                <Title order={3} className={classes.title}>
                    Article Title
                </Title>
            </Box>

            <Button variant='white' color='dark'>
                Read Article
            </Button>
        </Paper>
    )
}

export default BannerArticle