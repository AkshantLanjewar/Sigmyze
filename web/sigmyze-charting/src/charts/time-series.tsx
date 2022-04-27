import React, { useState, useEffect, SyntheticEvent } from "react"
import { createStyles } from "@mantine/core"

//import chart types
import LineChart from "./chart-types/line"

import { ChartMargin, ChartData } from "./chart-options"

//util funcs
import SortDatasets, { SortDatasetsOutput } from "./utils/datasets"
import { TimeScale, TimeSeriesTimeScale, TimeSeriesLinearScale, LinearScale } from "./utils/chart-axis"

//axis
import TimeAxis from './axis/time-axis'
import NumericalAxis from "./axis/numerical-axis"
//legend
import Legend, { LegendData } from "./utils/legend"

import * as d3 from 'd3'

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
    charts,
    verticalTooltip = true,
    horizontalTooltip = false,
    xAxis = true,
    yAxis = false
}: Props) {
    const { classes } = useStyles()
    const ref = React.createRef<SVGSVGElement>()
    const [lineCharts, setLineCharts] = useState<Array<ChartOptions>>([])

    //internal state
    const [svgDims, setSvgDims] = useState({ width: 0, height: 0, paddedHeight: 0 })
    const [svgPoint, setSvgPoint] = useState<DOMPoint | null>(null)
    const [scales, setScales] = useState<ScalesState>({ time: null, linear: null })
    const [sortedDatasets, setSortedDatasets] = useState<SortDatasetsOutput>()
    
    //on svg render
    useEffect(() => {
        const boundingBox = ref.current!.getBoundingClientRect()
        const svgPoint    = ref.current!.createSVGPoint()

        //get width and height
        const rawHeight = boundingBox.height
        const rawWidth  = boundingBox.width 
        const height    = rawHeight - margin.top - margin.bottom

        setSvgDims({ width: rawWidth, height: rawHeight, paddedHeight: height })
        setSvgPoint(svgPoint)
    }, [])

    //on charts
    useEffect(() => {
        let sortedDatasets: SortDatasetsOutput = SortDatasets(charts)

        let timeScale   = TimeScale({ sortedDatasets, width: svgDims.width, margin })
        let linearScale = LinearScale({ sortedDatasets, height: svgDims.paddedHeight, margin })

        let line_charts = [] as Array<ChartOptions>
        for(let i = 0; i < charts.length; i++) {
            let chart    = charts[i]
            chart.margin = margin

            if(chart.type == "line")
                line_charts.push(chart)
        }

        setScales({ time: timeScale, linear: linearScale })
        setLineCharts([...line_charts])
        setSortedDatasets(sortedDatasets)
    }, [svgDims, charts])

    let chart_output = []
    //consume line charts
    for(let i = 0; i < lineCharts.length && scales.time != null; i++)
        chart_output.push(<LineChart 
            timeScale={scales.time!} 
            linearScale={scales.linear!}  
            options={lineCharts[i]} 
            key={`line-${i}`} />)

    //tooltip state
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, date: new Date() })
    const [activeVert, setActiveVert] = useState(false)
    const [activeHorz, setActiveHorz] = useState(false)
    const [legendData, setLegendData] = useState<Array<LegendData>>([])

    function MouseOver() {
        if(verticalTooltip)
            setActiveVert(true)
        if(horizontalTooltip)
            setActiveHorz(true)
    }

    function MouseOut() {
        setActiveVert(false)
        setActiveHorz(false)
    }

    function MouseMove(event: any) {
        function sx(d: ChartData) { return d.date }
        const X  = d3.map(sortedDatasets!.longest_dataset, sx)

        function CursorPoint() {
            svgPoint!.x = event.clientX
            svgPoint!.y = event.clientY
            return svgPoint!.matrixTransform(ref.current!.getScreenCTM()!.inverse())
        }

        function Bisect(mx: number) {
            const date  = scales.time!.x.invert(mx)
            const index = d3.bisectCenter(X, date)
            
            return index
        }

        const index = Bisect(d3.pointer(event)[0])
        const yPos  = CursorPoint().y

        //set positions
        const date = sortedDatasets!.longest_dataset[index].date
        const xPos = scales.time!.x(date)
        setTooltipPos({ x: xPos, y: yPos, date: date })
    }

    return (
        <div className={classes.chartBuilder}>
            <div className={classes.chartContainer} style={{ width: `${yAxis ? 'calc(100% - 55px)' : '100%'}` }}>
                <svg 
                    className={classes.svg} 
                    ref={ref}
                    onMouseOver={MouseOver}
                    onMouseOut={MouseOut}
                    onMouseMove={MouseMove}
                >
                    {verticalTooltip
                        ?   (
                                <line
                                    className={classes.hoverLine}
                                    style={{ display: `${activeVert ? '' : 'none'}` }}
                                    transform={`translate(${tooltipPos.x}, 0)`}
                                    y1={0}
                                    y2={svgDims.height} />
                            )

                        : null
                    }

                    {horizontalTooltip
                        ?   (
                                <line
                                    className={classes.hoverLine}
                                    style={{ display: `${activeHorz ? '' : 'none'}` }}
                                    transform={`translate(0, ${tooltipPos.y})`}
                                    x1={0}
                                    x2={svgDims.width} />
                            )

                        : null
                    }
                    
                    {chart_output}
                </svg>

                {xAxis
                    ? <TimeAxis scale={scales.time!} tooltipPos={tooltipPos.x} tooltipDate={tooltipPos.date} activeTooltip={activeVert}  />
                    : null
                }
            </div>

            {yAxis
                ? <NumericalAxis scale={scales.linear!} tooltipPos={tooltipPos.y} activeTooltip={activeHorz} />
                : null
            }
        </div>
    )
}

export default TimeSeriesChart