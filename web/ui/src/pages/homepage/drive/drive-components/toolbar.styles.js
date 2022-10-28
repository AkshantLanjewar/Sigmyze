import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme, { opened }) => ({
    control: {
        width: 200,
        height: 36,

        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 15px',
        borderRadius: theme.radius.sm,
        transition: 'background-color 150ms ease',

        '&:hover': {
            backgroundColor: theme.colors.dark[5]
        }
    },

    label: {
        fontWeight: 500,
        fontSize: theme.fontSizes.sm
    },

    icon: {
        transition: 'transform 150ms ease'
    }
}))

export default useStyles