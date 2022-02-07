import React, {useEffect, useState} from "react"
import ChartBuilder, { ChartOptions, blueColor, redColor } from "../../../components/chart-builder"
import * as countries from 'i18n-iso-countries'
import * as d3 from 'd3'

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

function SingleCategoryCard(props) {
    let category = props.indicator
    /***COMMENT - Category is a misnomer. It is actually an indicator ****/

    let iso3 = props.iso3
    const chartRef = React.createRef()
    const cardRef = React.createRef()

    const [simpleName, setSimpleName] = useState("")
    const [scale, setScale] = useState()
    const [chartOptions, setChartOptions] = useState({})
    const [selfDisplay, setSelfDisplay] = useState({})
    const [cardSize, setCardSize] = useState({})

    useEffect(() => {
        chartRef.current.innerHTML = ""

        // Check for Covid. Set URL accorindgly //

        let covCheck = category.search(/cc|cd/i)
        let dataset=""

        // The below code is stop-gap. Needs a better, scalable logic
        if (covCheck>=0){
          dataset = 'COVID'
        }
        else{
          dataset = "WEO"
        }

        let url = `/api/data/v2/datasets/${dataset}/${iso3}/${category}`
        let xAxType = ""


        fetch(url)
            .then(response => response.json())
            .then(data => {
                let chart = new ChartBuilder(chartRef)
                let chartData = []
                var lowerI

                if (covCheck>=0){
                  //lowerI = Math.round(data['data'].length*1/3)
                  lowerI=0
                }
                else{
                  lowerI = 0
                }

                for(let i = lowerI; i < data['data'].length; i++) {
                    let object = {}
                    let dt = new Date(data['data'][i]["date"])

                    if (covCheck >=0){
                      object["date"] = dt
                      xAxType = 'D'
                    }
                    else {
                      object["date"] = dt.getUTCFullYear()
                      xAxType = 'Y'
                    }

                    object["value"] = data['data'][i]["value"]
                    chartData.push(object)
                }

                if(chartData.length == 0) {
                    cardRef.current.style.display = "none"
                    return
                } else {
                    cardRef.current.style.display = "flex"
                }

                let chartOptions = {
                    chartType: "line",
                    chartData: chartData,
                    chartName: category,
                    chartColor: blueColor,

                    showXAxis: 1,
                    showYAxis: 0,

                    formatterPre: `${category}: `,

                    xAxisType: xAxType,
                    yAxisType: "linear"
                }

                chart.AddLineChart(chartOptions)
                chart.CreateChart()

                setSimpleName(data['sName'])
                setScale(data['units'])
            })
    })

    return (
        <div className="card dark scaleHov" ref={cardRef}>
            <div className="title tooltip">
                <p class="titleLong" style={{marginBottom: "0.5em"}}>
                    <span>{iso3} {'>'} </span>
                    <span>{simpleName} {'('}{scale}{')'}</span>
                </p>

                <div className="titleShort">{category}</div>

                <span className="tooltiptext">United States National GDP</span>
            </div>

            <div className="chart" ref={chartRef}></div>
        </div>
    )
}

export default SingleCategoryCard
