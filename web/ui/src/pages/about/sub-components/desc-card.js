import React from "react"
import { 
    Card,
    ThemeIcon,
    List,
    createStyles
} from '@mantine/core'

import { BsCheck } from 'react-icons/bs'

const useStyles = createStyles((themes) => ({
    card: {
        backgroundColor: themes.colors.dark[6],
        height: "350px",
        width: "300px"
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

const DescriptionCard = ({ icon, title, description, features }) => {
    const { classes } = useStyles()

    return (
        <Card withBorder radius={"md"} className={classes.card} pt={"lg"} pb={"xl"}>
            <Card.Section pt="md" pb="sm" className={classes.centerSection}>
                <ThemeIcon radius={"xl"} size={"xl"} color={"gray"} className={classes.theme}>
                    {icon}
                </ThemeIcon>
            </Card.Section>

            <Card.Section className={classes.centerSection} pb={"xl"}>
                <h2>{title}</h2>
                <h5>{description}</h5>
            </Card.Section>

            <Card.Section pl="xl" pr="xl" pb={"lg"}>
                <List
                    spacing={"md"}
                    size={"sm"}
                    center
                    icon={
                        <ThemeIcon color="teal" size={24} radius={"xl"}>
                            <BsCheck size={16} />
                        </ThemeIcon>
                    }
                >
                    {features.map((feature) => (
                        <List.Item className={classes.boldFont}>{feature}</List.Item>
                    ))}
                </List>
            </Card.Section>
        </Card>
    )
}

export default DescriptionCard