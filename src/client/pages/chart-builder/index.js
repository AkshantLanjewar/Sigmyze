import React, { useState, useEffect } from "react"

import ChartBuilder from "./components/chart-builder"

function ChartBuilderPage(props) {
    const OnChartBuilder = props.OnChartBuilder
    const tChartList = [
        { iso3: "HRV", dataset: "WEO", ind3: "NGDP", type: "line" }
    ]

    useEffect(() => {
        OnChartBuilder()
    }, [])

    return (
        <ChartBuilder charts={tChartList} />
    )
}

export default ChartBuilderPage