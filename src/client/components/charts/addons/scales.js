import * as d3 from 'd3'

function ScaleUTC(data, dim, margin) {
    return d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, dim - margin.right])
}

function ScalePoint(data, dim, margin) {
    return d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, dim - margin.right])
}

function LinearAxisFormatter(data, height, margin) {
    return d3.scaleLinear()
        .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]).nice()
        .range([height, margin.top])
}

export { ScalePoint, ScaleUTC, LinearAxisFormatter }