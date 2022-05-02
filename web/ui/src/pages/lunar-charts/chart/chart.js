import React from "react"
import useStyles from "./chart.styles"

import { dummyLinearData } from "../../../data/dummy-data"
import { TimeSeries }      from "sigmyze-charting"

const Chart = ({ }) => {
    const { classes } = useStyles()
    let tChartOptions = { id: "USD-GBP", type: "line", data: dummyLinearData, color: "#031158" }

    return (
        <div className={classes.container}>
            <TimeSeries
                charts={[tChartOptions]}

                verticalTooltip={true}
                horizontalTooltip={true}
                xAxis={true}
                yAxis={true}
            />
        </div>
    )
}

export default Chart