import React from "react"
import ChartBuilder, { ChartOptions, blueColor, redColor } from "../../../components/chart-builder"
import * as countries from 'i18n-iso-countries'
import * as d3 from 'd3'

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

function ChartCard(props) {
    let category = props.indicator
    let iso3     = props.iso3

    const chartRef = React.createRef()
    const cardRef  = React.createRef()

    return (
        <div>

        </div>
    )
}

export default ChartCard