import { Chart } from "@antv/g2"
import React, { useEffect } from 'react'

const MiniLunarChart = ({ data, names, useTooltip, usePadding, paddingAmount }) => {
    const ref = React.createRef()

    function BuildChart() {
        let current       = ref.current
        current.innerHTML = ""

        let cfg            = {}
        cfg['container']   = current
        cfg['autoFit']     = true
        cfg['limitInPlot'] = true
        if(usePadding)
            cfg['padding'] = paddingAmount

        const chart = new Chart(cfg)

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
        chart.tooltip(false)
        if(useTooltip == true)
            chart.tooltip(true)

        chart.render()
    }

    useEffect(() => {
        BuildChart()
    }, [])

    useEffect(() => {
        BuildChart()
    }, [data])

    return (
        <div 
            ref={ref} 
            style={{ width: "100%", height: "100%", display: 'flex', alignItems: 'center' }}
        >

        </div>
    )
}

export default MiniLunarChart