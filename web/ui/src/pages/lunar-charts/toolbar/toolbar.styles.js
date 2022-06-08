import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => ({
    toolbar: {
        width: 340,
        backgroundColor: theme.colors.dark[8],
        borderTopRightRadius: theme.radius.md,
        borderBottomRightRadius: theme.radius.md,

        display: "flex",
        flexDirection: "row",
        overflow: "hidden"
    },

    actionBar: {
        height: "100%",
        borderRight: `2px solid ${theme.colors.dark[4]}`,
        width: 60,
        minWidth: 60,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 10,
        gap: 10
    },

    actionItem: {
        height: 45,
        width: 45,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colors.dark[3],
        cursor: "pointer",
        borderRadius: theme.radius.md,

        ['&:hover']: {
            backgroundColor: theme.colors.dark[5],
            color: theme.colors.dark[1]
        },
    },

    active: {
        backgroundColor: theme.colors.dark[5],
        color: theme.colors.dark[1]
    },

    contentBar: {
        flexGrow: 1,

        paddingTop: 45 / 2,
        paddingLeft: 15,
        paddingRight: 15,
        height: "100%"
    },

    contentTitle: {
        color: theme.colors.dark[0],
        fontWeight: 500,
        userSelect: "none",
        marginBottom: theme.spacing.lg
    },

    staticItem: {
        borderRadius: theme.radius.md,
        height: 35,
        color: theme.colors.dark[1],
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 1,
        cursor: "pointer",
    },

    staticInner: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
        justifyContent: "space-between"
    },

    leftLine: {
        height: "90%",
        width: 2,
        backgroundColor: theme.colors.blue[9],
        borderRadius: 200
    },

    staticText: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        height: "100%",
        alignItems: 'center',
        textOverflow: "ellipsis"
    },

    indicatorInput: {
        width: "100%",
        
        'input': {
            backgroundColor: theme.colors.dark[9]
        }
    },

    chart: {
        height: 40,
        width: 80
    },

    optionCard: {
        padding: 5,
        marginBottom: 10,
        cursor: "pointer",
        backgroundColor: theme.colors.dark[6]
    },

    activeOptionCard: {
        backgroundColor: theme.colors.dark[7]
    }
}))

export default useStyles