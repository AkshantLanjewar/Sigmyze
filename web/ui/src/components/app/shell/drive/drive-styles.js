import { createStyles } from "@mantine/core"

const LINK_HEIGHT      = 38
const INDICATOR_SIZE   = 10
const INDICATOR_OFFSET = (LINK_HEIGHT - INDICATOR_SIZE) / 2

const useStyles = createStyles((theme) => ({
    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        textDecoration: 'none',
        color: theme.colors.dark[0],
        lineHeight: `${LINK_HEIGHT}px`,
        fontSize: theme.fontSizes.md,
        height: LINK_HEIGHT,
        borderTopRightRadius: theme.radius.lg,
        borderBottomRightRadius: theme.radius.lg,
        borderLeft: `2px solid ${theme.colors.dark[4]}`,

        paddingLeft: theme.spacing.md,

        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        
        '&:hover': {
            backgroundColor: theme.colors.dark[6]
        }
    },

    linkActive: {
        fontWeight: 500,
        color: theme.colors[theme.primaryColor][3],
        backgroundColor: theme.colors.dark[6]
    },

    links: {
        position: 'relative'
    },

    indicator: {
        transition: `transform 150ms ease`,
        border: `2px solid ${theme.colors[theme.primaryColor][3]}`,
        backgroundColor: theme.colors.dark[7],
        height: INDICATOR_SIZE,
        width: INDICATOR_SIZE,
        borderRadius: INDICATOR_SIZE,
        position: 'absolute',
        left: -INDICATOR_SIZE / 2 + 1
    }
}))

export { LINK_HEIGHT, INDICATOR_OFFSET, INDICATOR_SIZE }

export default useStyles