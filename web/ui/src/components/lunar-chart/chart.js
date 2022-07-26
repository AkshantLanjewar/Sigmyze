import { Chart, registerInteraction } from '@antv/g2'
import React, { useEffect, useState } from 'react'

function LunarChart({
    data,
    scale_change,
    names
}) {
    const ref = React.createRef()

    registerInteraction('drag-move', {
        start: [{ trigger: 'plot:mousedown', action: 'scale-translate: start' }],
        processing: [{ trigger: 'plot:mousemove', action: 'scale-translate:translate', throttle: {wait: 100, leading: true, trailing: false} }],
        end: [{ trigger: 'plot:mouseup', action: 'scale-translate:end' }]
    })

    function BuildChart() {
        let current       = ref.current
        current.innerHTML = ""
        
        const chart = new Chart({
            container: current,
            autoFit: true,
            limitInPlot: true,
        })

        chart.data(data)

        chart.scale('date', {
            type: 'time'
        })

        chart.scale('y', {
            type: 'linear',
            nice: true
        })

        chart.tooltip({
            showCrosshairs: true,
            shared: true
        })

        for(let i = 0; i < names.length; i++) {
            let name = names[i]
            let pos  = `date*${name}`

            if(i == 0)
                chart.axis(name, {
                    position: 'right',
                    grid: null
                })
            else
                chart.axis(name, false)

            chart.line().position(pos)
        }

        chart.interaction('view-zoom')
        chart.interaction('drag-move')
        chart.render()
    }
    
    useEffect(() => {
        BuildChart()
    }, [])

    useEffect(() => {
        BuildChart()
    }, [data, scale_change])

    return (
        <div ref={ref} 
            style={{ width: "100%", height: "100%", padding: "1em" }}
        >

        </div>
    )
}

export default LunarChart