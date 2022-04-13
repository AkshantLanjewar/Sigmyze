import React, { useState, useEffect } from "react"
import { createStyles } from "@mantine/core"

//import chart types
import LineChart from "./chart-types/line"

//chart styles
const useStyles = createStyles((theme: any) => ({
    svg: {
        height: "100%"
    },

    chartBuilder: {
        width: "100%",
        height: "100%",

        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        margin: "0 auto"
    },

    chartContainer: {
        width: "calc(100% - 0px)",
        height: "100%",

        display: "flex",
        flexDirection: "column",
        position: "relative"
    },

    hoverLine: {
        strokeWidth: "2px",
        strokeDasharray: "5",
        stroke: theme.colors.dark[3]
    },
}))

import Props, { ChartOptions } from './chart-options'

function TimeSeriesChart({
    margin,
    axisIndex = -1,
    charts
}: Props) {
    const { classes } = useStyles()
    const ref = React.createRef<SVGSVGElement>()
    const [lineCharts, setLineCharts] = useState([])

    //internal state
    const [activeAxis, setActiveAxis] = useState({ x: null, y: null })
    const [svgDims, setSvgDims] = useState({ width: 0, height: 0, paddedHeight: 0 })
    const [svgPoint, setSvgPoint] = useState<DOMPoint | null>(null)
    
    //on svg render
    useEffect(() => {
        const boundingBox = ref.current!.getBoundingClientRect()
        const svgPoint    = ref.current!.createSVGPoint()

        //get width and height
        const rawHeight = boundingBox.height
        const rawWidth  = boundingBox.width 
        const height    = rawWidth - margin.top - margin.bottom

        setSvgDims({ width: rawWidth, height: rawHeight, paddedHeight: height })
        setSvgPoint(svgPoint)
    }, [])

    let chart_output = []
    //consume line charts
    for(let i = 0; i < lineCharts.length; i++)
        chart_output.push(<LineChart options={{ id: "", type: "line", data: [] }} key={`line-${i}`} />)

    return (
        <div className={classes.chartBuilder}>
            <div className={classes.chartContainer}>
                <svg className={classes.svg} ref={ref}>
                    {chart_output}
                </svg>
            </div>
        </div>
    )
}

export default TimeSeriesChart