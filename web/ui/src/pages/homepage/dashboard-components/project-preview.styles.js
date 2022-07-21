import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => ({
    card: {
        cursor: 'pointer',
        backgroundColor: theme.colors.dark[5],
        border: `1px solid ${theme.colors.dark[7]}`,
        width: 303.31
    },

    chart: {
        backgroundColor: theme.colors.dark[8],
        minHeight: 220,
        display: 'flex',
        justifyContent: 'center',
        height: 220
    },

    title: {
        color: theme.white,
        fontWeight: 500,
        lineHeight: 1,
        marginBottom: 7
    },

    description: {
        color: theme.colors.dark[2],
        fontSize: theme.fontSizes.xs,
        lineHeight: 1.5
    },

    body: {
        marginTop: theme.spacing.md
    }
}))

export default useStyles