import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => {
    return {
        background: {
            backgroundColor: theme.colors.dark[9]
        },

        wrapper: {
            position: 'relative',
            paddingTop: 120,
            paddingBottom: 80,
            
            '@media (max-width: 755px)': {
                paddingTop: 80,
                paddingBottom: 60
            }
        },

        inner: {
            position: "relative",
            zIndex: 1,
            paddingBottom: theme.spacing.xl
        },

        dots: {
            position: 'absolute',
            color: theme.colors.dark[5],

            '@media (max-width: 755px)': {
                display: 'none'
            }
        },

        title: {
            textAlign: 'center',
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: -1,
            color: theme.white,
            marginBottom: theme.spacing.xs,
            fontFamily: 'Poppins',

            '@media (max-width: 520px)': {
                fontSize: 28,
                textAlign: 'left'
            }
        },

        description: {
            textAlign: 'center',

            '@media (max-width: 520px)': {
                textAlign: 'left',
                fontSize: theme.fontSizes.md
            }
        }
    }
})

export default useStyles