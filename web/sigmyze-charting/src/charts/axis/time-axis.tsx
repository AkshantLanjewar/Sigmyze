import React, { useState, useEffect } from "react"
import { xAxisStyles } from './axis-styles'

import { TimeSeriesTimeScale } from '../utils/chart-axis'
import { v4 as uuidv4 } from 'uuid'

interface Props {
    tooltipDate: Date,
    tooltipPos: number,
    activeTooltip: boolean,
    scale: TimeSeriesTimeScale
}

interface TickData {
    margin: number
    tick: string
}

function TimeAxis({ tooltipPos, tooltipDate, activeTooltip, scale } : Props) {
    const { classes } = xAxisStyles()
    const ref = React.createRef<HTMLDivElement>()

    const [ticks, setTicks] = useState<Array<TickData>>([])
    const [focusPos, setFocusPos] = useState(0)
    const formattingOptions: any = { month: 'long', day: 'numeric', year: 'numeric' } 

    function Reset() {
        setTicks([])
        setFocusPos(0)
    }

    useEffect(() => {
        let boundingRect = ref.current!.getBoundingClientRect()
        let valPosition  = tooltipPos - 47.5

        if(valPosition < 0)
            valPosition = 0
        let oValPosition = tooltipPos + 47.5
        if(oValPosition > boundingRect.width)
            valPosition = boundingRect.width - 110

        setFocusPos(valPosition)
    }, [tooltipPos])

    useEffect(() => {
        if(scale == null) {
            Reset()
            return
        }

        let ticks: Array<TickData> = []
        for(let i = 0; i < scale.ticks.length; i++) {
            let tick  = scale.ticks[i]
            let d_str = tick.toLocaleDateString("en-US", formattingOptions)
            ticks.push({ tick: d_str, margin: scale.x(tick) } as TickData)
        }

        setTicks(ticks)
    }, [scale])

    return (
        <div className={classes.xAxis} ref={ref}>
            <div className={classes.tickValue} style={{ display: `${activeTooltip ? '' : 'none'}`, left: `${focusPos}px` }}>
                { tooltipDate.toLocaleDateString("en-US", formattingOptions) }
            </div>

            {ticks.map((step) => (
                <div className={classes.tick} style={{ left: `${step.margin - 12}px` }} key={uuidv4()}>
                    {step.tick}
                </div>
            ))}
        </div>
    )
}

export default TimeAxis