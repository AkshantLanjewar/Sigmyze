import React, { useState, useEffect } from "react"
import { yAxisStyles } from './axis-styles'
import { v4 as uuidv4 } from 'uuid'
import { TimeSeriesLinearScale } from '../utils/chart-axis'

interface Props {
    activeTooltip: boolean,
    scale: TimeSeriesLinearScale,
    tooltipPos: number
}

interface TickData {
    margin: number,
    tick: number
}

function NumericalAxis({ tooltipPos, scale, activeTooltip } : Props) {
    const { classes } = yAxisStyles()
    const ref = React.createRef<HTMLDivElement>()

    const [ticks, setTicks]         = useState<Array<TickData>>([])
    const [tickValue, setTickValue] = useState(0)

    function Reset() {
        setTicks([])
        setTickValue(0)
    }

    useEffect(() => {
        if(scale == null) {
            Reset()
            return
        }

        let ticks: Array<TickData> = []
        for(let i = scale.ticks.length - 1; i >= 0; i--) {
            let tick = scale.ticks[i]
            ticks.push({ tick: tick, margin: scale.y(tick) } as TickData)
        }

        setTicks(ticks)
    }, [scale])

    useEffect(() => {
        if(scale == null) {
            Reset()
            return
        }

        let axis = scale.y
        let val  = axis.invert(tooltipPos)
        setTickValue(parseFloat(val.toFixed(2)))
    }, [tooltipPos])

    return (
        <div className={classes.yAxis} ref={ref}>
            <div className={classes.inner}>
                <div className={classes.tickValue} style={{ display: `${activeTooltip ? '' : 'none'}`, top: `${tooltipPos - 12.5}px` }}>
                    {tickValue}
                </div>

                {ticks.map((step) => (
                    <div key={uuidv4()} className={classes.tick} style={{ top: `${step.margin - (15 / 2)}px` }}>
                        {step.tick}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NumericalAxis