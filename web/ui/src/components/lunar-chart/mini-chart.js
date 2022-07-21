import { Chart } from "@antv/g2"
import React, { useEffect } from 'react'

const MiniLunarChart = ({ data, names }) => {
    const ref = React.createRef()

    function BuildChart() {
        let current       = ref.current
        current.innerHTML = ""

        const chart = new Chart({
            container: current,
            autoFit: true,
            limitInPlot: true
        })

        chart.data(data)

        chart.scale('date', {
            type: 'time'
        })

        chart.scale('y', {
            type: 'linear',
            nice: true
        })

        
        for(let i = 0; i < names.length; i++) {
            let name = names[i]
            let pos  = `date*${name}`

            chart.axis(name, false)
            chart.line().position(pos)
        }

        chart.axis('date', false)
        chart.render()
    }

    useEffect(() => {
        BuildChart()
    }, [])

    useEffect(() => {
        BuildChart()
    }, [data])

    return (
        <div ref={ref} style={{ width: "100%", height: "100%", padding: "1em" }}>

        </div>
    )
}

export default MiniLunarChart