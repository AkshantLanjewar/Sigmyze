import React, { useEffect, useState } from "react"
import useStyles from "./chart.styles"

import { useMantineTheme } from "@mantine/core"
import { GetIndicator } from '../../../data/server-interface'

import BuildChart, { ProcessData } from "./chart-backend"
import * as am5 from "@amcharts/amcharts5"
import * as am5xy from "@amcharts/amcharts5/xy"

import { connect } from "react-redux"

/*
    CHART COMPONENT

    [param] indicators: list of indicators passed to component from redux
*/

const Chart = ({ indicators }) => {
    const { classes }       = useStyles()
    const [chart, setChart] = useState(null)
    const chartRef          = React.createRef()
    const theme             = useMantineTheme()

    /*
        MAIN FUNCTION IN COMPONENT

        [param] ref: passes the chart ref to main so it can build its amchart

        [fetch] GetIndicator -> data: grabs all the indicator data, so it can be pushed to amcharts
        
    */
    async function main(ref) {
        let chartData = []
        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            let data      = await GetIndicator(indicator.dataset, indicator.object_id, indicator.indicator_id)
            chartData.push(ProcessData(data['indicator_data']))
        }

        if(chart == null)
            return
        chart.chart.series.clear()
        for(let i = 0; i < chartData.length; i++) {
            let data   = chartData[i]
            let data_u = []

            for(let x = 0; x < data.length; x++) {
                if(typeof data[x]['value'] == 'number')
                    data_u.push(data[x])
            }

            let series = chart.chart.series.push(
                am5xy.LineSeries.new(chart.root, {
                    name: "Series",
                    xAxis: chart.xAxis,
                    yAxis: chart.yAxis,
                    valueYField: "value",
                    valueXField: "date",
                    stroke: am5.color(theme.colors.red[4]),
                    x: 0
                })
            ) 

            series.strokes.template.setAll({
                strokeWidth: 2,
            })

            series.data.setAll(data_u)
        }
    }

    useEffect(() => {
        setChart(BuildChart(theme))
        main(chartRef)
    }, [])

    useEffect(() => {
        main(chartRef)
    }, [chart, indicators])

    return (
        <div className={classes.container}>
            <div ref={chartRef} className={classes.chart} id={"main-chart"}>

            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    indicators: state.lunar.indicators
})

const mapDispatchToProps = state => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Chart)