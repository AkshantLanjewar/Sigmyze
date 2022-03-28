import React, { useState, useEffect } from 'react'

function YAxis(props) {
    const activeAxis      = props.activeAxis
    const tooltipPosition = props.tooltipPosition
    const activeTooltip   = props.activeTooltip

    const [ticks, setTicks]         = useState([])
    const [tickValue, setTickValue] = useState(0)

    function Reset() {
        setTicks([])
        setTickValue(0)
    }
    
    useEffect(() => {
        if(activeAxis.y == null) {
            Reset()
            return
        }

        let yAxis  = activeAxis.y
        let uTicks = []
        for(let i = yAxis.tickRange.length - 1; i >= 0; i--)
            uTicks.push({ tick: parseFloat(yAxis.tickRange[i].toFixed(2)), margin: yAxis.y(yAxis.tickRange[i])})
        setTicks(uTicks)
    }, [activeAxis])

    useEffect(() => {
        if(activeAxis.y == null) {
            Reset()
            return
        }

        let yAxis  = activeAxis.y
        let yPos   = tooltipPosition.y
        let yValue = yAxis.y.invert(yPos)
        setTickValue(parseFloat(yValue.toFixed(2)))
    }, [tooltipPosition])

    return (
        <div className='y-axis'>
            <div className='inner'>
                <div className='tickValue' style={{display: `${activeTooltip ? '' : 'none'}`, top: `${tooltipPosition.y - 12.5}px` }}>
                    {tickValue}
                </div>

                {ticks.map((step) => (
                    <div className='tick' style={{top: `${step.margin - (15 / 2)}px`}}>
                        {step.tick}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default YAxis