import * as d3 from 'd3'

interface TimeSeriesData {
    date: Date,
    value: number
}

export interface LineOptions {
    lineWidth: number,
    lineColor: string
}

function LineChart(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
                lineData: Array<TimeSeriesData>,
                x: d3.ScaleTime<number, number, never>,
                y: d3.ScaleLinear<number, number, never>) {
    

    let line = d3.line<TimeSeriesData>()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y(d => y(d.value))

    svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)
        .attr("transform", `translate(0,20)`)
}

export default LineChart