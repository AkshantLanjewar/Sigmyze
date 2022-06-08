import React     from "react"

import Navbar  from "./navbar/navbar"
import Toolbar from "./toolbar/toolbar"
import Chart   from "./chart/chart"

import useStyles from "./lunar-charts.styles"

const LunarCharts = ({ }) => {
    const { classes } = useStyles()

    return (
        <div className={classes.wrapper}>
            <Navbar />

            <div className={classes.body}>
                <Toolbar />
                <Chart />
            </div>
        </div>
    )
}

export default LunarCharts