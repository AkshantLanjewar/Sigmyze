import React, { useState, useEffect } from 'react'
import { ChartOptions } from '../chart-options'
import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme: any) => ({
    chartLegend: {
        position: "absolute",
        left: "10px",
        top: "20px",

        width: "auto",
        minHeight: "20px",
        minWidth: "100px",
        fontSize: "13px",
        userSelect: "none"
    },

    element: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "1em"
    },

    label: {
        marginRight: "4px"
    },

    value: {
        color: "red"
    }
}))

interface LegendData {
    id: string,
    label: string,
    value: number | string
}

interface Props {
    data: Array<LegendData>
}

function Legend({ data } : Props) {
    const { classes } = useStyles()

    return (
        <div className={classes.chartLegend}>
            {data.map((step) => (
                <div className={classes.element}>
                    <div className={classes.label}>{step.label}</div>
                    <div className={classes.value}>{step.value}</div>
                </div>
            ))}
        </div>
    )
}

export { LegendData }
export default Legend