import React, { useEffect, useState } from "react"
import CreateChart from "../../../components/charts/lunar-charts"
import * as countries from 'i18n-iso-countries'

import { GetIndicatorV } from "../../../data/indicator"

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

function ChartCard(props) {
    let category = props.indicator
    let iso3 = props.iso3

    const setModalState      = props.setModalState
    const setActiveIndicator = props.setActiveIndicator

    const chartRef = React.createRef()
    const cardRef = React.createRef()

    const [simpleName, setSimpleName] = useState("")
    const [scale, setScale] = useState()
    const [display, setDisplay] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            chartRef.current.innerHTML = ""

            // Check for Covid. Set URL accorindgly //

            let covCheck = category.search(/cc|cd/i)
            let dataset = ""
            if (covCheck >= 0)
                dataset = 'COVID'
            else
                dataset = "WEO"

            async function anon() {
                let data = await GetIndicatorV(iso3, category, dataset)
                if(data.data == undefined) {
                    setDisplay(false)
                    return
                }
                if(data.data.length == 0)
                    setDisplay(false)
                
                let chartOpts = {
                    container: chartRef,
                    containerHeight: 186,
                    type: 'line',
                    name: `${data['fullname']}`,
                    dataset: dataset,
                    data: data.data
                }

                CreateChart(chartOpts)
            }

            anon()
        }, 500)
    }, [])

    return (
        <div className="card light scaleHov"
            ref={cardRef}
            style={{ marginTop: "0.5em", width: "25%", height: "264px", display: display ? "flex" : "none" }}
            onClick={() => { setModalState(true); setActiveIndicator(category) }}>
            <div className="title tooltip">
                <p className="titleLong" style={{ marginBottom: "0.5em" }}>
                    <span>{iso3} {'> '}</span>
                    <span>{simpleName} {'('}{scale}{')'}</span>
                </p>

                <div className="titleShort">{category}</div>

                <span className="tooltiptext">United States National GDP</span>
            </div>

            <div className="chart" style={{ height: "186px", width: "100%" }} ref={chartRef}></div>
        </div>
    )
}

export default ChartCard