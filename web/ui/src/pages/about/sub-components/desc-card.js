import React from "react"
import { 
    Card,
    ThemeIcon,
    List,
    createStyles
} from '@mantine/core'

import { BsCheckLg } from 'react-icons/bs'

const useStyles = createStyles((themes) => ({
    card: {
        //backgroundColor: themes.colors.dark[6]
    },

    theme: {
        backgroundColor: themes.colors.dark[3],
        fontSize: "2rem",
        height: "60px",
        width: "60px",
        borderRadius: "50%"
    },

    centerSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },

    boldFont: {
        fontWeight: "700"
    }
}))

const DescriptionCard = ({ icon, title }) => {
    const { classes } = useStyles()

    return (
        <Card withBorder radius={"md"} className={classes.card} pt={"lg"} pb={"xl"}>
            <Card.Section pt="md" pb="sm" className={classes.centerSection}>
                <ThemeIcon radius={"xl"} size={"xl"} color={"gray"} className={classes.theme}>
                    {icon}
                </ThemeIcon>
            </Card.Section>

            <Card.Section className={classes.centerSection} pb={"xl"}>
                <h2>Charting</h2>
                <h5>Visualize and Display Data</h5>
            </Card.Section>

            <Card.Section pl="xl" pr="xl" pb={"lg"}>
                <List
                    spacing={"md"}
                    size={"sm"}
                    center
                    icon={
                        <ThemeIcon color="teal" size={24} radius={"xl"}>
                            <BsCheckLg size={10} />
                        </ThemeIcon>
                    }
                >
                    <List.Item className={classes.boldFont}>Multi Axis Charts</List.Item>
                    <List.Item className={classes.boldFont}>Multiple Chart Types</List.Item>
                    <List.Item className={classes.boldFont}>Exportable to PNG and SVG formats</List.Item>
                </List>
            </Card.Section>
        </Card>
    )
}

export default DescriptionCard