import React, { useEffect, useState } from "react"
import ChartBuilder, { ChartOptions, blueColor, redColor } from '../../components/chart-builder'

type props = {
    title?: string,
    shortTitle?: string
}

type State = {
    shortA: string,
    shortB: string,
    fullTitle: string,
}

const SampleCard: React.FC<props> = ({ children, title = "10 Year Bonds / Unemployment", shortTitle = "10yBOND/UNEM" }) => {

    const chartRef = React.createRef<HTMLDivElement>()

    //setup state
    let initalState: State = {
        shortA: "",
        shortB: "",
        fullTitle: ""
    }

    const [state, setState] = useState(initalState)

    useEffect(() => {
        chartRef.current!.innerHTML = ""

        const url = "/api/data/sample_indicator"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let chart: ChartBuilder = new ChartBuilder(chartRef!)
                let shortA = ""
                let shortB = ""
                let fullName  = ""

                for(let i = 0; i < data.indicators.length; i++) {
                    let indicator: any = data.indicators[i]
                    let cData = indicator["data"]["data"]

                    let chartData = []
                    for(let i = 0; i < cData.length; i++) {
                        let object: any = {}

                        var dt = new Date(cData[i]["date"])

                        object["date"] = dt.getUTCFullYear()
                        object["value"] = cData[i]["value"]
                        chartData.push(object)
                    }

                    let chartOptions: ChartOptions = {
                        chartType: "line",
                        chartData: chartData,
                        chartName: indicator.descriptor.shortName,
                        chartColor: blueColor,

                        showXAxis: false,
                        showYAxis: false,

                        formatterPre: `${indicator.descriptor.shortName}: `,

                        xAxisType: "utc",
                        yAxisType: "linear"
                    }

                    if(i == 1)
                        chartOptions.chartColor = redColor

                    chart.AddLineChart(chartOptions)

                    if(i == 0) {
                        shortA = indicator.descriptor.shortName
                        fullName  = indicator.descriptor.fullname + " / "
                    }
                    else {
                        shortB = indicator.descriptor.shortName
                        fullName  += indicator.descriptor.fullname
                    }
                }

                chart.CreateChart()
                setState({...state, shortA: shortA, shortB: shortB, fullTitle: fullName})
            })
    }, [])

    return (
        <div className="sample-card">
            <div className="title tooltip">
                <span style={{color: blueColor}}>{state.shortA}</span><span>/</span><span style={{color: redColor}}>{state.shortB}</span>

                <span className="tooltiptext">{ state.fullTitle }</span>
            </div>

            <div className="chart" ref={chartRef}>

            </div>
        </div>
    )
}

export default SampleCard
