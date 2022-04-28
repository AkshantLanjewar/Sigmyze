import React from "react";

import {
    Card,
    Title,
    createStyles
} from "@mantine/core"

import { dummyLinearData } from "../../../data/dummy-data";
import { TimeSeries } from 'sigmyze-charting'

const useStyles = createStyles((theme) => ({
    card: {
        width: "32%"
    },

    chartSection: {
        height: "200px"
    }
}))

const ChartCard = ({  }) => {
    const { classes } = useStyles()

    let tChartOptions = { id: "USD-GBP", type: "line", data: dummyLinearData, color: "#031158" }

    return (
        <Card p={"xl"} radius={"sm"} shadow={"md"} className={classes.card}>
            <Card.Section pl={"lg"} pr={"lg"} pt={"md"} pb={"md"}>
                <Title order={3}>Card Chart</Title>
            </Card.Section>

            <Card.Section className={classes.chartSection}>
                <TimeSeries
                    horizontalTooltip={false}
                    xAxis={false}
                    charts={[tChartOptions]} />
            </Card.Section>
        </Card>
    )
}

export default ChartCard;