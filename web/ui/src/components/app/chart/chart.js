import React, { useState, useEffect } from "react";

import BuildCharts from "./chartLogic";

import {
    createStyles
} from "@mantine/core"

const useStyles = createStyles((theme) => ({
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
        right: 5,
        bottom: 10,
        left: 5
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
        BuildCharts(svgRef, margin, setFUNCS)
    }, [])

    return (
        <div className={classes.chartBuilder}>
            <div className={classes.chartContainer}>

                <svg
                    ref={svgRef}
                >
                    <line
                        className={classes.hoverLine} />
                    <line
                        className={classes.hoverLine} />
                </svg>
            </div>
        </div>
    )
}

export default ChartBuilder