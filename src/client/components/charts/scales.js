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

function LinearAxisFormatter() {
    
}

export { ScalePoint, ScaleUTC }