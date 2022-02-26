import * as d3 from 'd3'

function SetupTooltip(opts, margin, svg) {
    const tooltip = svg.append("g")
        .attr('class', 'focus')
        .style('display', 'none')
    
    let line = tooltip.append("line")
        .attr('class', 'hover-line')
        .attr('y1', 0)
        .attr('y2', height)
}

export default SetupTooltip