import React     from "react"

import Navbar from "./navbar/navbar"
import useStyles from "./lunar-charts.styles"

const LunarCharts = ({ }) => {
    const { classes } = useStyles()

    return (
        <div className={classes.wrapper}>
            <Navbar />
        </div>
    )
}

export default LunarCharts