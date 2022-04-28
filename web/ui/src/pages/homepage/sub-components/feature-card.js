import React from "react"

import {
    Card,
    Title,
    createStyles
} from "@mantine/core"

const useStyles = createStyles((theme) => ({
    card: {
        width: "32%",
        background: theme.colors.dark[7],
        height: "300px"
    },
}))

const FeatureCard = ({ title, description }) => {
    const { classes } = useStyles()

    return (
        <Card radius={"sm"} mt={"xl"} mb={"xl"} p={"xl"} className={classes.card}>
            <Card.Section pl={"lg"} pr={"lg"} pt={"md"} pb={"md"}>
                <Title order={3}>{title}</Title>
            </Card.Section>

            <Card.Section p={"lg"}>
                <p>{description}</p>
            </Card.Section>
        </Card>
    )
}

export default FeatureCard