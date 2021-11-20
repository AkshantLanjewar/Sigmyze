import React, { useEffect, useState } from "react"

import BuildAxis from '../echart-builder/axis-builder'
import SChartBuilder from '../echart-builder/echarts-builder'

type XYData = {
    date: Date,
    value: number
}

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

    useEffect(() => {
        if(initialCreate == true)
            return

        let chartBuilder = new SChartBuilder()
        chartBuilder.SetTitle("Swagadelphia")

        let xAxis = new BuildAxis()
    }, [initialCreate])

    return (
        <div className="overview-chart" ref={chartRef}>
        </div>
    )
}

export default OverviewChart