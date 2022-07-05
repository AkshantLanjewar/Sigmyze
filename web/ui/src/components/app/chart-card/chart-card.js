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

import { connect } from "react-redux"
import { 
    ResetLunarIndicator,
    AddLunarIndicator 
} from "../../../data/actions/lunarActions"

const ChartCard = ({ 
    data = dummyLinearData, 
    title = "Chart Fullname", 
    description = "Small", 
    verticalTooltip = true, 
    height = "auto",
    active = false,
    dataset = 'weo',
    resetLunarIndicator,
    addLunarIndicator
}) => {
    const { classes } = useStyles()

    let margin = {
        top: 20,
        bottom: 20,
        left: 10,
        right: 10
    }
    let tChartOptions = { id: "USD-GBP", type: "line", data: data, color: "#031158" }

    function OpenChart() {
        resetLunarIndicator()

        //build request
        let d_description = description.replace(' ', '')
        let desc_parts    = d_description.split(":")
        let iso3          = desc_parts[0]
        let ind3          = desc_parts[1]

        let payload = { ind3: ind3, iso3: iso3, dataset: dataset }
        addLunarIndicator(payload)
        window.location.replace("/lunar")
    }

    return (
        <Card radius={"md"} className={classes.card} sx={(theme) => ({height: height, border: active ? `2px solid ${theme.colors.blue[4]}` : '' })}>
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
                        <Menu.Item onClick={OpenChart} icon={<GiPlanetCore size={14} />}>Open Chart</Menu.Item>
                    </Menu>
                </Group>
            </div>
        </Card>
    )
}

const mapStateToProps = state => ({
    
})

const mapDispatchToProps = dispatch => ({
    resetLunarIndicator: (payload) => dispatch(ResetLunarIndicator(payload)),
    addLunarIndicator: (payload) => dispatch(AddLunarIndicator(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartCard)