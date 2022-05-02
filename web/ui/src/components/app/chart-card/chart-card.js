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

const ChartCard = ({ data = dummyLinearData, title = "Chart Fullname", description = "Small", verticalTooltip = true, height = "auto" }) => {
    const { classes } = useStyles()

    let margin = {
        top: 20,
        bottom: 20,
        left: 10,
        right: 10
    }
    let tChartOptions = { id: "USD-GBP", type: "line", data: data, color: "#031158" }

    return (
        <Card radius={"md"} className={classes.card} sx={{ height: height }}>
            <Card.Section className={classes.chart}>
                <TimeSeries
                    margin={margin}
                    horizontalTooltip={false}
                    verticalTooltip={verticalTooltip}
                    xAxis={false}
                    charts={[tChartOptions]} />
            </Card.Section>

            <div className={classes.body}>
                <Text className={classes.title}>{title}</Text>
                <Group position="apart">
                    <Text className={classes.description}>{description}</Text>
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