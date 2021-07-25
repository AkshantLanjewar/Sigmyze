import React, { useEffect } from "react"
import ChartBuilder, { ChartOptions, blueColor, redColor } from '../components/charts/chart-builder'

const SampleCard: React.FC<{}> = ({ children }) => {

    const chartRef = React.createRef<HTMLDivElement>()

    useEffect(() => {
        chartRef.current!.innerHTML = ""

        let lineData = [
            { date: new Date("2007-04-23"), value: 200 },
            { date: new Date("2008-04-23"), value: 250 },
            { date: new Date("2009-04-23"), value: 450 },
            { date: new Date("2010-04-23"), value: 300 }
        ]

        let revData = [
            { date: new Date("2007-04-23"), value: 300 },
            { date: new Date("2008-04-23"), value: 400 },
            { date: new Date("2009-04-23"), value: 250 },
            { date: new Date("2010-04-23"), value: 200 }
        ]

        let chartOptions: ChartOptions = {
            chartType: "line",
            chartData: lineData,
            chartName: "line-chart",
            chartColor: blueColor,

            showXAxis: false,
            showYAxis: false,

            xAxisType: "utc",
            yAxisType: "linear"
        }

        let chart: ChartBuilder = new ChartBuilder(chartRef!)
        chart.AddLineChart(chartOptions)

        let revOptions: ChartOptions = {
            chartType: "line",
            chartData: revData,
            chartName: "line-chart",
            chartColor: redColor,

            showXAxis: false,
            showYAxis: false,

            xAxisType: "utc",
            yAxisType: "linear"
        }

        chart.AddLineChart(revOptions)
        chart.CreateChart()
    })

    return (
        <div className="sample-card">
            <div className="title tooltip">
                10yBOND/UNEM

                <span className="tooltiptext">10 Year Bonds / Unemployment</span>
            </div>

            <div className="chart" ref={chartRef}>
                
            </div>
        </div>
    )
}

export default SampleCard