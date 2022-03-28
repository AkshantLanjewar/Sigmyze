import React, { useState, useEffect } from "react"

import ChartBuilder from "./components/chart-builder"

function ChartBuilderPage(props) {
    const OnChartBuilder   = props.OnChartBuilder
    const activeIndicators = props.activeIndicators

    useEffect(() => {
        OnChartBuilder()
    }, [])

    return (
        <ChartBuilder charts={activeIndicators} />
    )
}

export default ChartBuilderPage