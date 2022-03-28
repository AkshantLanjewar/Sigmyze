import { setgid } from 'process'
import React, { useState, useEffect } from 'react'

function XAxis(props) {
    const ref = React.createRef()

    const activeAxis      = props.activeAxis
    const tooltipPosition = props.tooltipPosition
    const activeTooltip   = props.activeTooltip

    const [ticks, setTicks]             = useState([])
    const [tickValue, setTickValue]     = useState(new Date())
    const [valPosition, setValPosition] = useState(0)
    const formattingOptions = { month: 'long', day: 'numeric', year: 'numeric' }

    function Reset() {
        setTicks([])
        setTickValue(new Date())
        setValPosition(0)
    }

    useEffect(() => {
        if(activeAxis.x == null) {
            Reset()
            return
        }
        
        let axis   = activeAxis.x
        let uTicks = []
        for(let i = 0; i < axis.tickRange.length; i++)
            uTicks.push({ tick: axis.tickRange[i], margin: axis.x(axis.tickRange[i])})
        setTicks(uTicks)
    }, [activeAxis])

    useEffect(() => {
        if(activeAxis.x == null) {
            Reset()
            return
        }
        
        let date = new Date(tooltipPosition.date, 0, 1)
        setTickValue(date)
        let boundingRect = ref.current.getBoundingClientRect()
        
        let tValPosition = tooltipPosition.x - 47.5
        if(tValPosition < 0)
            tValPosition = 0
        let oValPosition = tooltipPosition.x + 47.5
        if(oValPosition > boundingRect.width)
            tValPosition = boundingRect.width - 95

        setValPosition(tValPosition)
    }, [tooltipPosition])

    return (
        <div className='x-axis' ref={ref}>
            <div className='tickValue' style={{ display: `${activeTooltip ? '' : 'none'}`, left: `${valPosition}px` }}>
                {tickValue.toLocaleDateString("en-US", formattingOptions)}
            </div>

            {ticks.map((step) => (
                <div className='tick' style={{ left: `${step.margin - 12}px` }}>
                    {step.tick}
                </div>
            ))}
        </div>
    )
}

export default XAxis