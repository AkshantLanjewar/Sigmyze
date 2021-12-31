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

    const [fullname, setFullname] = useState("")
    const [scale, setScale] = useState()

    useEffect(() => {
        chartRef.current!.innerHTML = ""
        const url = `/api/data/indicator/${iso3}/${category}`
        //let url = `/api/data/v2/datasets/WEO/${iso3}/${iShort}`

        fetch(url)
            .then(response => response.json())
            .then(data => {
                let chart: ChartBuilder = new ChartBuilder(chartRef!)
                let chartData = []
                for(let i = 0; i < data.data.length; i++) {
                    let object: any = {}
                    let dt = new Date(data.data[i]["date"])

                    object["date"] = dt.getUTCFullYear()
                    //object["date"] = (data.data[i]["date"])
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

                    showXAxis: 1,
                    showYAxis: 0,

                    formatterPre: `${category}: `,

                    xAxisType: "utc",
                    yAxisType: "linear"
                }

                chart.AddLineChart(chartOptions)
                chart.CreateChart()

                setFullname(data['simpleName'])
                setScale(data['scale'])
            })
    })

    return (
        <div className="card dark scaleHov" ref={cardRef}>
            <div className="title tooltip">
                <h5 style={{marginBottom: "1em"}}>
                    <span>{iso3} {'>'} </span>
                    <span>{fullname} {'('}{scale}{')'}</span>
                </h5>

                <div>{category}</div>

                <span className="tooltiptext">United States National GDP</span>
            </div>

            <div className="chart" ref={chartRef}></div>
        </div>
    )
}

export default SingleCategoryCard
