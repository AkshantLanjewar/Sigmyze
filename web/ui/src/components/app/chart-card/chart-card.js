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

/*
    CHART CARD COMPONENT
    [description] -> this creates the basic card chart that is displayed throughout the website

    [param] data: this is the data that is filtered into the component
    [format] -> 
        1. date: [UTC time of date]
        2. value: float or int value

    [param] title: this is the title of the chart that will be displayed in a title format
    [param] description: this is the shortform of the chart
        ex: object_id:indicator_id
    
    [param] verticalTooltip: this is whether or not you need a vertical tooltip line on the chart
    [param] height: this is the height of the card, automatically set to auto
    [param] active: used in indicator selection, determines whether card should contain a border
    [param] dataset: this is the dataset used to query data from the server
    
    [param] resetLunarIndicator -> REDUX: this is a redux function that clears all the lunar charts state
    [param] addLunarIndicator -> REDUX: this is a redux function that adds an indicator to the charts state
*/

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

    /*
        OPEN CHART FUNCTION
        [description]: opens the chart in the main lunar chart editor

        [payload]: creates a payload with the following features for redux
            1. indicator_id: the indicator_id of the data that was passed to it
            2. object_id: the object_id of the data that was passed to it
            3. dataset: the dataset that the data belongs too
    */
    function OpenChart() {
        resetLunarIndicator()

        //build request
        let d_description = description.replace(' ', '')
        let desc_parts    = d_description.split(":")
        let object_id     = desc_parts[0]
        let indicator_id  = desc_parts[1]

        let payload = { indicator_id: indicator_id, object_id: object_id, dataset: dataset }
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