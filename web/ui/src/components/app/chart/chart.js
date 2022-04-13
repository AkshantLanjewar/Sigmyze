import React, { useState, useEffect } from "react";

import BuildCharts from "./chartLogic";

import {
    createStyles
} from "@mantine/core"

const useStyles = createStyles((theme) => ({
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

const ChartBuilder = ({ chartList }) => {
    const { classes } = useStyles()
    const svgRef      = React.createRef()

    const [svgDims, setSvgDims]                 = useState({ width: 0, height: 0, paddedHeight: 0 })
    const [linePaths, setLinePaths]             = useState([])
    const [activeTooltip, setActiveTooltip]     = useState(false)
    const [activeAxis, setActiveAxis]           = useState({ x: null, y: null, data: [] })
    const [svgPoint, setSvgPoint]               = useState(null)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const [chartBuilt, setChartBuilt]           = useState(false)
    const [datasets, setDatasets]               = useState([])
    const [activeValues, setActiveValues]       = useState([])

    let margin = {
        top: 10, 
        right: 20,
        bottom: 10,
        left: 20
    }

    const setFUNCS = {
        'setSvgDims': setSvgDims,
        'setLinePaths': setLinePaths,
        'setActiveTooltip': setActiveTooltip,
        'setActiveAxis': setActiveAxis,
        'setSvgPoint' :setSvgPoint,
        'setTooltipPosition': setTooltipPosition,
        'setChartBuilt': setChartBuilt,
        'setDatasets': setDatasets,
        'setActiveValues': setActiveValues
    }

    useEffect(() => {
        if(chartBuilt == false)
            setTimeout(() => {
                BuildCharts(chartList, svgRef, margin, setFUNCS)
            }, 400)
        
        if(chartBuilt == false) {
            setActiveAxis({ x: null, y: null, data: [] })
            setDatasets([])
            setLinePaths([])
            setChartBuilt(false)

            BuildCharts(chartList, svgRef, margin, setFUNCS)
        }
    }, [chartList])

    return (
        <div className={classes.chartBuilder}>
            <div className={classes.chartContainer}>

                <svg
                    className={classes.svg}
                    ref={svgRef}
                >
                    <line
                        
                        className={classes.hoverLine} />
                    <line
                        className={classes.hoverLine} />

                    {linePaths.map((step) => (
                        <path
                            key={`line-path-${step}`}
                            fill="none"
                            stroke="#456ef7"
                            strokeWidth={"2px"}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            transform={`translate(0, ${margin.top})`}
                            d={step.path}
                        />
                    ))}
                </svg>
            </div>
        </div>
    )
}

export default ChartBuilder