import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => ({
    articleCard: {
        backgroundColor: theme.colors.dark[8]
    },

    articleTitle: {
        fontFamily: 'Poppins',
        fontSize: 22
    },

    articleSubtitle: {
        fontFamily: 'Poppins',
        fontSize: 15,
        paddingLeft: 2.5
    },

    articleFooter: {
        padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`,
        marginTop: theme.spacing.md,
        borderTop: `1px solid ${theme.colors.dark[5]}`
    }
}))

export default useStyles