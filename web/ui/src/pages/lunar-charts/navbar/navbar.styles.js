import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => ({
    navbar: {
        width: "100%",
        height: 60,
        backgroundColor: theme.colors.dark[9],

        paddingLeft: 20,
        paddingRight: 20,

        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },

    filenameGroup: {
        gap: 5,
        color: theme.colors.dark[2]
    },

    folder: {
        fontSize: 14,
        userSelect: "none"
    },

    file: {
        fontSize: 14,
        color: theme.colors.dark[0],
        cursor: "pointer",
        userSelect: "none"
    }
}))

export default useStyles