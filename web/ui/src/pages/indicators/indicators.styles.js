import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme, _params, getRef) => {
    const image = getRef('image')

    return {
        header: {
            position: "relative",
            minHeight: "700px",
            background: theme.colors.dark[9]
        },

        headerContainer: {
            paddingTop: "140px",
            position: "relative",
            zIndex: "1"
        },

        headerTitle: {
            color: theme.white,
            fontSize: 44,
            lineHeight: 1.2,
            fontWeight: 900
        },

        headerSpan: {
            color: theme.colors.blue[4]
        },

        headerDescription: {
            color: theme.colors.dark[2],
            lineHeight: 1.5,
            maxWidth: 580,
            marginTop: theme.spacing.md
        },

        headerFeatures: {
            marginTop: 100,
            maxWidth: 740,
            paddingBottom: theme.spacing.xl,

            '@media (max-width: 755px)': {
                marginTop: theme.spacing.xl * 2
            }
        },

        featureBody: {
            marginTop: theme.spacing.md
        },

        featureTitle: {
            color: theme.white,
            fontWeight: 500,
            lineHeight: 1,
            marginBottom: 7
        },

        featureDescription: {
            color: theme.colors.dark[2],
            fontSize: theme.fontSizes.xs,
            lineHeight: 1.5
        },

        group: {
            '& + &': {
                marginTop: theme.spacing.xl * 4
            }
        },

        groupHeader: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,

            '@media (max-width: 755px)': {
                display: 'block'
            }
        },

        wrapper: {
            paddingTop: 80
        },

        groupTitle: {
            fontWeight: 500,
            lineHeight: 1,
            color: theme.white
        },

        groupCount: {
            marginLeft: theme.spacing.md,
            marginTop: 10,

            '@media (max-width: 755px)': {
                marginTop: theme.spacing.xs,
                marginLeft: 0
            }
        },

        card: {
            cursor: 'pointer',
            position: 'relative',
            backgroundColor: theme.colors.dark[5],
            border: `1px solid ${theme.colors.dark[7]}`,

            [`&:hover .${image}`]: {
                transform: `scale(1.025)`
            }
        },

        cardTitle: {
            marginTop: theme.spacing.sm
        },

        cardDescription: {
            color: theme.colors.dark[2],
            marginTop: 2
        },

        imageWrapper: {
            backgroundColor: theme.colors.dark[8],
            minHeight: 154,
            display: 'flex',
            justifyContent: 'center'
        },

        image: {
            ref: image,
            transition: 'transform 500ms ease'
        }
    }
})

export default useStyles