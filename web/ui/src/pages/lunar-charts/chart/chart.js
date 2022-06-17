import React, { useEffect, useState } from "react"
import useStyles from "./chart.styles"

import { useMantineTheme } from "@mantine/core"
import { GetIndicator } from '../../../data/server-interface'

import BuildChart, { ProcessData } from "./chart-backend"
import * as am5 from "@amcharts/amcharts5"
import * as am5xy from "@amcharts/amcharts5/xy"

import { connect } from "react-redux"

const Chart = ({ indicators }) => {
    const { classes } = useStyles()
    const [chart, setChart] = useState(null)
    const chartRef = React.createRef()
    const theme = useMantineTheme()

    async function main(ref) {
        let chartData = []
        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            let data      = await GetIndicator(indicator.dataset, indicator.iso3, indicator.ind3)
            chartData.push(ProcessData(data['data']))
        }

        chart.chart.series.clear()
        for(let i = 0; i < chartData.length; i++) {
            let data   = chartData[i]
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

            series.data.setAll(data)
        }
    }

    useEffect(() => {
        setChart(BuildChart(theme))
    }, [])

    useEffect(() => {
        main(chartRef)
    }, [indicators, chart])

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