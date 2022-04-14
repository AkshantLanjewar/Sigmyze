import React, { useState, useEffect } from "react"
import { createStyles } from "@mantine/core"

//import chart types
import LineChart from "./chart-types/line"

import { ChartMargin } from "./chart-options"

//util funcs
import SortDatasets, { SortDatasetsOutput } from "./utils/datasets"
import { TimeScale, TimeSeriesTimeScale, TimeSeriesLinearScale, LinearScale } from "./utils/chart-axis"

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

interface ScalesState {
    time: TimeSeriesTimeScale | null,
    linear: TimeSeriesLinearScale | null
}

let defaultMargin: ChartMargin = {
    top: 10,
    bottom: 10,
    left: 20,
    right: 20
}

function TimeSeriesChart({
    margin = defaultMargin,
    axisIndex = -1,
    charts
}: Props) {
    const { classes } = useStyles()
    const ref = React.createRef<SVGSVGElement>()
    const [lineCharts, setLineCharts] = useState<Array<ChartOptions>>([])

    //internal state
    const [activeAxis, setActiveAxis] = useState({ x: null, y: null })
    const [svgDims, setSvgDims] = useState({ width: 0, height: 0, paddedHeight: 0 })
    const [svgPoint, setSvgPoint] = useState<DOMPoint | null>(null)
    const [scales, setScales] = useState<ScalesState>({ time: null, linear: null })
    
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

    //on charts
    useEffect(() => {
        let sortedDatasets: SortDatasetsOutput = SortDatasets(charts)

        let timeScale   = TimeScale({ sortedDatasets, width: svgDims.width, margin })
        let linearScale = LinearScale({ sortedDatasets, height: svgDims.paddedHeight, margin })
        setScales({ time: timeScale, linear: linearScale })

        let line_charts = [] as Array<ChartOptions>
        for(let i = 0; i < charts.length; i++) {
            let chart = charts[i]

            if(chart.type == "line")
                line_charts.push(chart)
        }

        setLineCharts([...line_charts])
    }, [charts])

    let chart_output = []
    //consume line charts
    for(let i = 0; i < lineCharts.length; i++)
        chart_output.push(<LineChart 
            timeScale={scales.time} 
            linearScale={scales.linear}  
            options={lineCharts[i]} 
            key={`line-${i}`} />)

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