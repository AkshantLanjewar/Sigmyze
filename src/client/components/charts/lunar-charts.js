import * as d3 from 'd3'

import SetupTooltip from './addons/tooltip'
import LineChart from './chart-types/line-chart'

function CreateChart(opts) {
    let container       = opts['container']
    let name            = opts['name']
    let chartType       = opts['type']
    let containerHeight = 0

    let margin = {
        top: 20,
        right: 10,
        bottom: 20,
        left: 10
    }

    if("margin" in opts) {
        if("top" in opts['margin'])
            margin['top'] = opts['margin']['top']
        if("bottom" in opts['margin'])
            margin['bottom'] = opts['margin']['bottom']
        if("right" in opts['margin'])
            margin['right'] = opts['margin']['right']
        if("left" in opts['margin'])
            margin['left'] = opts['margin']['left']
    }

    if("containerHeight" in opts)
        containerHeight = `${opts['containerHeight']}px`
    else
        containerHeight = "100%"

    let svg = d3.select(container.current)
                .append("svg")
                .attr("width", "100%")
                .attr("height", containerHeight)
                .style('overflow', 'visible')
                .style('z-index', '999')

    let boundingBox = svg.node().getBoundingClientRect()
    const rawWidth = boundingBox.width
    const rawHeight = boundingBox.height - margin.top
    
    svg.append("defs")
        .append("clipPath")
        .attr("id", name)
        .append('rect')
        .attr("width", rawWidth)
        .attr("height", rawHeight)

    opts['width']  = rawWidth
    opts['height'] = rawHeight

    if(chartType == 'line')
        opts['axis'] = LineChart(opts, margin, svg)
    if(opts['tooltip'] == true)
        SetupTooltip(opts, margin, svg)
}

export default CreateChart