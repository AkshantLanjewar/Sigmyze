import React, { useEffect, useState } from "react"

function Legend(props) {
    const [indicators, setIndicators] = useState([])

    useEffect(() => {
        if(props.indicators !== undefined)
            setIndicators(props.indicators)
    }, [props.indicators])

    return (
        <div className="chart-legend">
            {indicators.map((step) => {
                let title = `${step.fName}: ${step.indicatorF}`
                let color = step.color
                if(color == undefined)
                    return

                return (
                    <div className="item-row">
                        <hr className="color-line" style={{backgroundColor: color.hex}} />
                        <div className="label">{title}</div>
                        <div className="value">240.22</div>
                    </div>
                )
            })}
        </div>
    )
}

export default Legend