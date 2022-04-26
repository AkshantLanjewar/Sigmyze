import React,{ useEffect, useState } from "react"

import { TimeSeriesTimeScale, TimeSeriesLinearScale } from '../utils/chart-axis'
import { ChartOptions, ChartData } from '../chart-options'

import * as d3 from 'd3'

interface LineProps {
    options: ChartOptions,
    
    timeScale: TimeSeriesTimeScale,
    linearScale: TimeSeriesLinearScale
}

function LineChart({ options, timeScale, linearScale }: LineProps) {
    function LinePath(x: d3.ScaleTime<number, number, never>, y: d3.ScaleLinear<number, number, never>) {
        let line = d3.line<ChartData>()
            .x(d => x(d.date))
            .y(d => y(d.value))

        return line
    }

    const [path, setPath] = useState("")
    let mTop = options.margin?.top

    useEffect(() => {
        let Path = LinePath(timeScale.x, linearScale.y)
        let pth  = Path(options.data)!
        console.log(linearScale.y(options.data[0].value))

        setPath(pth)
    }, [timeScale, linearScale])

    return (
        <path
            fill={"none"}
            stroke={"#456ef7"}
            strokeWidth={"2px"}
            strokeLinejoin="round"
            strokeLinecap="round"
            transform={`translate(0, ${mTop!})`}
            d={path}
        />
    )
}

export default LineChart