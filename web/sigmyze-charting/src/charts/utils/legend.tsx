import React, { useState, useEffect } from 'react'
import { ChartOptions } from '../chart-options'

interface LegendData {
    id: string,
    value: number
}

interface Props {
    charts: Array<ChartOptions>,
    data: Array<LegendData>
}

function Legend({ data, charts } : Props) {
    return (
        <div>

        </div>
    )
}

export { LegendData }
export default Legend