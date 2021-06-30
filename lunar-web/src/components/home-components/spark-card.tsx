import React, { RefObject, useEffect } from "react"
import ChartBuilder, { SeriesOptions } from "../charting/chart-builder"

function SparkCard() {
    const chartRef: RefObject<HTMLDivElement> = React.createRef()

    useEffect(() => {
        let sparkOptions: SeriesOptions = {
            seriesName: "spark_series",
            seriesType: "line",

            showXAxis: false,
            showYAxis: false,
            xAxisType: 'time',
            yAxisType: 'value',
            yAxisPos: 'left',
            smooth: true,
            spark: true,

            xAxisData: [new Date('2000'), new Date('2001'), new Date('2002'), new Date('2003'), new Date('2004')],
            yAxisData: [250, 350, 200, 75, 235]
        }

        let chartBuilder: ChartBuilder = new ChartBuilder()
        chartBuilder.AddSeries(sparkOptions)
        chartBuilder.BuildChart(chartRef.current!)
    })

    return (
        <div className="card">
            <div className="title">
                <div className="text">
                    <h2>US Unemployment compared to Covid</h2>
                </div>
            </div>

            <div className="body">
                <div className="chart" ref={chartRef}></div>
            </div>
        </div>
    )
}

export default SparkCard