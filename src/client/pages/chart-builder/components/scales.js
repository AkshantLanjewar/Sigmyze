import * as d3 from 'd3'

function ScaleUTC(data, dim, margin) {
    return d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, dim - margin.right])
}

function LinearAxisFormatter(min, max, height, margin) {
    return d3.scaleLinear()
        .domain([min, max]).nice()
        .range([height, margin.top])
}

export { ScaleUTC, LinearAxisFormatter }