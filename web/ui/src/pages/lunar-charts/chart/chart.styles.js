import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => ({
    container: {
        flexGrow: 1,
        marginRight: 10,

        backgroundColor: theme.colors.dark[8],
        height: "calc(100% - 10px)",
        borderRadius: theme.radius.md
    },

    chart: {
        width: "100%",
        height: "100%"
    }
}))

export default useStyles