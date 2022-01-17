import React, { useEffect, useState } from "react"

function Legend(props) {
    const [indicators, setIndicators] = useState([])
    const [values, setValues] = useState({})
    const [unitsObj, setUnitsObj] = useState({})


    useEffect(() => {
        if(props.indicators == undefined && props.values == {})
            return

        setIndicators(props.indicators)
        setValues(props.values)

        setUnitsObj(props.units)

    }, [props.indicators, props.values])

    return (
        <div className="chart-legend">
            {indicators.map((step) => {
                let title = `${step.fName}: ${step.indicatorF}`
                let color = step.color
                if(color == undefined)
                    return

                let req = `${step.iso3}-${step.indicator}`
                let value = values[req]
                let units = unitsObj[req]
                return (
                    <div className="item-row">
                        <hr className="color-line" style={{backgroundColor: color.hex}} />
                        <div className="label">{title}</div>
                        <div className="value">{value}</div>
                        <div className="units"> {units}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default Legend
