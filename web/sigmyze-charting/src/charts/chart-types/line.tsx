import React from "react"

import { TimeSeriesTimeScale, TimeSeriesLinearScale } from '../utils/chart-axis'
import { ChartOptions, ChartData } from '../chart-options'

import * as d3 from 'd3'

interface LineProps {
    options: ChartOptions,
    
    timeScale: TimeSeriesTimeScale | null,
    linearScale: TimeSeriesLinearScale | null
}

function LineChart({ options, timeScale, linearScale }: LineProps) {
    function LinePath(x: d3.ScaleTime<number, number, never>, y: d3.ScaleLinear<number, number, never>) {
        let line = d3.line<ChartData>()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value))

        return line
    }

    const Path = LinePath(timeScale!.x, linearScale!.y)

    return (
        <path
            fill={"none"}
            stroke={"#456ef7"}
            strokeWidth={"2px"}
            strokeLinejoin="round"
            strokeLinecap="round"
            d={}
        />
    )
}

export default LineChart