import React, { useEffect, useState } from "react"

import BuildAxis from '../echart-builder/axis-builder'
import SChartBuilder from '../echart-builder/echarts-builder'

import { ReactEChart } from '../../../components/echarts'

import { XYData } from '../echart-builder/types'

let dummyData: Array<XYData> = [
    {date: new Date("2010"), value: 400},
    {date: new Date("2011"), value: 200},
    {date: new Date("2012"), value: 400},
    {date: new Date("2013"), value: 500},
    {date: new Date("2014"), value: 350},
    {date: new Date("2015"), value: 700},
    {date: new Date("2016"), value: 100},
    {date: new Date("2017"), value: 250},
    {date: new Date("2018"), value: 425},
    {date: new Date("2019"), value: 555},
    {date: new Date("2020"), value: 822},
]

function OverviewChart() {
    const chartRef = React.createRef<HTMLDivElement>()
    const [initialCreate, setInitialCreate] = useState(false)
    
    let initalOpts = {}
    const [chartOptions, setChartOptions] = useState(initalOpts)

    useEffect(() => {
        if(initialCreate == true)
            return

        let xAxisData = []
        let yAxisData = []
        for(let i = 0; i < dummyData.length; i++) {
            xAxisData.push(dummyData[i].date.toDateString())
            yAxisData.push(dummyData[i].value)
        }

        const xAxis: BuildAxis = new BuildAxis()
        xAxis.SetAxisType("category")
        xAxis.SetAxisData(xAxisData)
        xAxis.HideSplitLine()

        const yAxis: BuildAxis = new BuildAxis()
        yAxis.SetAxisType("value")
        yAxis.HideSplitLine()

        const chartBuilder: SChartBuilder = new SChartBuilder()
        chartBuilder.AddLineChart(yAxisData, xAxis.GetAxis(), yAxis.GetAxis(), "chart")
        chartBuilder.BuildTooltip()
        const chartOPTS = chartBuilder.BuildChart()
        setChartOptions(chartOPTS)
    }, [initialCreate])

    return (
        <div className="overview-chart" ref={chartRef}>
            <ReactEChart option={chartOptions} style={{height: "100%"}} />
        </div>
    )
}

export default OverviewChart