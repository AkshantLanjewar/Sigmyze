import React from "react";

import {
    Card,
    Title,
    createStyles
} from "@mantine/core"

import ChartBuilder from "../../../components/app/chart/chart";

const useStyles = createStyles((theme) => ({
    card: {
        width: "32%"
    }
}))

const ChartCard = ({  }) => {
    const { classes } = useStyles()

    return (
        <Card p={"xl"} radius={"sm"} shadow={"md"} className={classes.card}>
            <Card.Section pl={"lg"} pr={"lg"} pt={"md"} pb={"md"}>
                <Title order={3}>Card Chart</Title>
            </Card.Section>

            <Card.Section>
                <ChartBuilder />
            </Card.Section>
        </Card>
    )
}

export default ChartCard;