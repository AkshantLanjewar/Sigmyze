import React, { useEffect, RefObject } from "react"
import ChartBuilder, { SeriesOptions } from "../charting/chart-builder"


function CarouselCard() {
    const containerRef: RefObject<HTMLDivElement> = React.createRef()
    //creating the chart in useEffect
    useEffect(() => {
        let lineOptions: SeriesOptions = {
            seriesName: "USA GDP",
            seriesType: 'line',
            showXAxis: true,
            showYAxis: true,
            xAxisType: 'time',
            yAxisType: 'value',
            yAxisPos: 'left',
            smooth: true,

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
        chartBuilder.BuildChart(containerRef.current!)
    })

    return (
        <div className="card">
            <div className="title">
                <div className="text">
                    <h2>United States GDP compared to Covid</h2>
                    <h4>By Lunar</h4>
                </div>

                <div className="date-frames">
                    <div className="pill red">
                        <span>USGDP</span>
                    </div>

                    <div className="pill grey">
                        GCOVID
                    </div>
                </div>
            </div>

            <div className="body">
                <div className="chart" ref={containerRef}></div>
            </div>
        </div>
    )
}

export default CarouselCard