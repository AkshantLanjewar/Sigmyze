import { createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
    th: {
        padding: '0!important'
    },

    control: {
        width: '100%',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

        '&:hover': {
            backgroundColor: theme.colors.dark[6]
        }
    },

    icon: {
        width: 21,
        height: 21,
        borderRadius: 21
    }
}))

export default useStyles