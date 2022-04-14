import React from "react"

import { TimeSeriesTimeScale, TimeSeriesLinearScale } from '../utils/chart-axis'
import { ChartOptions } from '../chart-options'

interface LineProps {
    options: ChartOptions,
    
    timeScale: TimeSeriesTimeScale | null,
    linearScale: TimeSeriesLinearScale | null
}

function LineChart({ options, timeScale, linearScale }: LineProps) {
    return (
        <path />
    )
}

export default LineChart