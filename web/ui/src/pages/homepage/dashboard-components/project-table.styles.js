import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => ({
    grid: {
        borderBottom: `1px solid ${theme.colors.dark[3]}`,
        marginBottom: '1em'
    }
}))

export default useStyles