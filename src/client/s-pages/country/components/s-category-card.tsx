import React, {useEffect, useState} from "react"
import ChartBuilder, { ChartOptions, blueColor, redColor } from "../../../components/chart-builder"
import * as countries from 'i18n-iso-countries'

type props = {
    category: string,
    iso3: string,
}

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

const SingleCategoryCard: React.FC<props> = ({ category, iso3 }) => {
    const chartRef = React.createRef<HTMLDivElement>()
    const cardRef = React.createRef<HTMLDivElement>()

    useEffect(() => {
        chartRef.current!.innerHTML = ""
        const url = `/api/data/indicator/${iso3}/${category}`

        fetch(url)
            .then(response => response.json())
            .then(data => {
                let chart: ChartBuilder = new ChartBuilder(chartRef!)
                let chartData = []
                for(let i = 0; i < data.data.length; i++) {
                    let object: any = {}

                    object["date"] = new Date(data.data[i]["date"])
                    object["value"] = data.data[i]["value"]
                    chartData.push(object)
                }

                if(chartData.length == 0) {
                    cardRef.current!.style.display = "none"
                    return
                } else {
                    cardRef.current!.style.display = "flex"
                }

                let chartOptions: ChartOptions = {
                    chartType: "line",
                    chartData: chartData,
                    chartName: category,
                    chartColor: blueColor,

                    showXAxis: false,
                    showYAxis: false,

                    formatterPre: `${category}: `,

                    xAxisType: "utc",
                    yAxisType: "linear"
                }

                chart.AddLineChart(chartOptions)
                chart.CreateChart()
            })
    })

    return (
        <div className="card dark" ref={cardRef}>
            <div className="title tooltip">
                <span>{countries.getName(iso3, "en", {select: "official"})} {category}</span>

                <span className="tooltiptext">United States National GDP</span>
            </div>

            <div className="chart" ref={chartRef}></div>
        </div>
    )
}

export default SingleCategoryCard