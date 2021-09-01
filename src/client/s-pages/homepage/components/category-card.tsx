import React, { useEffect, useState } from "react"
import ChartBuilder, { ChartOptions, blueColor, redColor } from '../../../components/chart-builder'

type props = {
    category_a: string,
    category_b: string
}

type State = {
    shortA: string,
    shortB: string,
    fullName: string,
}

const CategoryCard: React.FC<props> = ({ category_a, category_b }) => {
    const chartRef = React.createRef<HTMLDivElement>()

    const initalState: State = {
        shortA: "",
        shortB: "",
        fullName: ""
    }
    const [state, setState] = useState(initalState)
    useEffect(() => {
        chartRef.current!.innerHTML = ""

        const url = `/api/data/indicator/categories/pair/${category_a}/${category_b}`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let chart: ChartBuilder = new ChartBuilder(chartRef!)

                let shortA, shortB, fullName = ""
                let indicators = data["data"]
                for(let i = 0; i < indicators.length; i++) {
                    let indicator: any = indicators[i]
                    let cData = indicator["data"]["data"]

                    let chartData = []
                    for(let i = 0; i < cData.length; i++) {
                        let object: any = {}

                        object["date"] = new Date(cData[i]["date"])
                        object["value"] = cData[i]["value"]
                        chartData.push(object)
                    }

                    let chartOptions: ChartOptions = {
                        chartType: "line",
                        chartData: chartData,
                        chartName: indicator.name,
                        chartColor: blueColor,

                        showXAxis: false,
                        showYAxis: false,

                        formatterPre: `${indicator.name}: `,

                        xAxisType: "utc",
                        yAxisType: "linear"
                    }

                    if(i == 1)
                        chartOptions.chartColor = redColor
                    
                    chart.AddLineChart(chartOptions)

                    if(i == 0) {
                        shortA = indicator.name
                    }
                    else {
                        shortB = indicator.name
                    }
                }

                chart.CreateChart()
                setState({...state, shortA: shortA, shortB: shortB, fullName: fullName})
            })
    }, [category_a, category_b])

    return (
        <div className="carousel-card" key={category_b}>
            <div className="title tooltip">
                <span style={{color: blueColor}}>{state.shortA}</span><span>/</span><span style={{color: redColor}}>{state.shortB}</span>

                <span className="tooltiptext">{state.fullName}</span>
            </div>

            <div className="chart" ref={chartRef}>
                
            </div>
        </div>
    )
}

export default CategoryCard