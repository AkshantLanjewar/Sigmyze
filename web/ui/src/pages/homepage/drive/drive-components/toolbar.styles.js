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
        fontSize: theme.fontSizes.sm,
        maxWidth: 100,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },

    icon: {
        transition: 'transform 150ms ease'
    }
}))

export default useStyles