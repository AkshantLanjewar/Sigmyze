import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => {

    return {
        header: {
            position: "relative",
            minHeight: 500,
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
        
        altHeaderSpan: {
            color: theme.colors.green[2]
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
    }
})

export default useStyles