import * as d3 from 'd3'
import LineChart from './line-chart'

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
        LineChart(opts, margin)
}

export default CreateChart