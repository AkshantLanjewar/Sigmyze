import React, { useEffect } from "react"
import ChartBuilder from '../components/charts/chart-builder'

const SampleCard: React.FC<{}> = ({ children }) => {

    const chartRef = React.createRef<HTMLDivElement>()

    useEffect(() => {
        chartRef.current!.innerHTML = ""

        let chart: ChartBuilder = new ChartBuilder(chartRef!)
        chart.AddChart("line")
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