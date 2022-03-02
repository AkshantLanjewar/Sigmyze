import React, { useState, useEffect } from "react"

function ChartBuilderPage(props) {
    const OnChartBuilder = props.OnChartBuilder

    useEffect(() => {
        OnChartBuilder()
    }, [])

    return (
        <div className="chart-builder">

        </div>
    )
}

export default ChartBuilderPage