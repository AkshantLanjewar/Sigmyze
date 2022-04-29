import React from "react"

import {
    Card, 
    Group,
    Text,
    Menu 
} from "@mantine/core"

import useStyles from "./chart-card.styles"

import { TimeSeries } from 'sigmyze-charting'
import { dummyLinearData } from "../../../data/dummy-data"

import { GiPlanetCore } from 'react-icons/gi'

const ChartCard = ({ verticalTooltip }) => {
    const { classes } = useStyles()

    let margin = {
        top: 20,
        bottom: 20,
        left: 10,
        right: 10
    }
    let tChartOptions = { id: "USD-GBP", type: "line", data: dummyLinearData, color: "#031158" }

    return (
        <Card radius={"md"} className={classes.card}>
            <Card.Section className={classes.chart}>
                <TimeSeries
                    margin={margin}
                    horizontalTooltip={false}
                    verticalTooltip={verticalTooltip}
                    xAxis={false}
                    charts={[tChartOptions]} />
            </Card.Section>

            <div className={classes.body}>
                <Text className={classes.title}>Chart Fullname</Text>
                <Group position="apart">
                    <Text className={classes.description}>SMALL</Text>
                    <Menu
                        position={"right"}
                        placement={"end"}
                        withArrow
                    >
                        <Menu.Label>Charts</Menu.Label>
                        <Menu.Item icon={<GiPlanetCore size={14} />}>Open Chart</Menu.Item>
                    </Menu>
                </Group>
            </div>
        </Card>
    )
}

export default ChartCard