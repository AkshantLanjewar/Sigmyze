import { createStyles } from "@mantine/core"

let borderCoeff = 5

const useStyles = createStyles((theme) => ({
    search: {
        fontSize: 16,
        height: 45,
        borderRadius: theme.radius.sm,
        color: theme.colors.dark[2],
        backgroundColor: theme.colors.dark[8],
        paddingLeft: theme.spacing.xl,
        paddingRight: theme.spacing.xl,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        maxWidth: 300,
        alignItems: "center",

        ['&:hover']: {
            backgroundColor: theme.colors.dark[9]
        }
    },

    input: {
        'input': {
            height: 50,
            lineHeight: 48,
            paddingRight: 16.6,
            paddingLeft: 50,
            fontSize: 18,
            backgroundColor: theme.colors.dark[7],

            borderRadius: "4px 4px 0px 0px",
            outline: "none!important",
            border: "none!important",
            
        },

        '.mantine-TextInput-icon': {
            width: 50
        }
    },

    countries: {
        backgroundColor: theme.colors.dark[8]
    },

    country: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBlock: 5,

        ['&:hover']: { backgroundColor: theme.colors.dark[borderCoeff] },
        ['&.active']: { backgroundColor: theme.colors.dark[borderCoeff] }
    }
}))

export default useStyles