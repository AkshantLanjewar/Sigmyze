import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => ({
    wrapper: {
        backgroundColor: theme.colors.dark[7],
        height: "100vh",

        display: "flex",
        flexDirection: "column",
        gap: 10,
    },

    body: {
        flexGrow: 1,
        display: "flex",
        gap: 10
    }
}))

export default useStyles