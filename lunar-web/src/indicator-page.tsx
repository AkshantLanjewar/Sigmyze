import React, { useEffect, RefObject } from "react"

import ChartBuilder, { SeriesOptions } from "./components/charting/chart-builder"

function IndicatorOverview(props: any) {

    const mainChartRef: RefObject<HTMLDivElement> = React.createRef()

    useEffect(() => {
        let lineOptions: SeriesOptions = {
            seriesName: "USA GDP",
            seriesType: 'line',
            showXAxis: true,
            showYAxis: true,
            xAxisType: 'time',
            yAxisType: 'value',
            yAxisPos: 'left',
            smooth: false,

            xAxisData: [new Date('2000'), new Date('2001'), new Date('2002'), new Date('2003'), new Date('2004')],
            yAxisData: [250, 350, 200, 150, 235]
        }

        let barOptions: SeriesOptions = {
            seriesName: "US Total Covid Cases",
            seriesType: 'bar',
            showXAxis: false,
            showYAxis: false,
            xAxisType: 'time',
            yAxisType: 'value',
            yAxisPos: 'left',

            xAxisData: [new Date('2000'), new Date('2001'), new Date('2002'), new Date('2003'), new Date('2004')],
            yAxisData: [200, 500, 1000, 800, 750]
        }

        let chartBuilder: ChartBuilder = new ChartBuilder()
        chartBuilder.AddSeries(lineOptions)
        chartBuilder.AddSeries(barOptions)
        chartBuilder.BuildChart(mainChartRef.current!, true)
    })

    return (
        <main className="indicator-wrap">            
            <div className="paper">
                <div className="indicator-title">
                    <h1>United States GDP Compared to Daily Covid Cases <span>(USGDP)</span></h1>
                    <h4>By Lunar</h4>
                </div>

                <div className="main-chart">
                    <div className="chart" ref={mainChartRef}></div>
                </div>

                <div className="tab-container">
                    
                </div>
            </div>
        </main>
    )
}

export default IndicatorOverview