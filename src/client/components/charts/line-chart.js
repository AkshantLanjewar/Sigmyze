import * as d3 from 'd3'
import { ScaleUTC, ScalePoint, LinearAxisFormatter } from './scales'

function LineChart(opts, margin, svg) {
    function LinePath(x, y) {
        let line = d3.line()
                    .defined(d => !isNaN(d.value))
                    .x(d => x(d.date))
                    .y(d => y(d.value))

        return line
    }

    let dataset   = opts['dataset']
    let width     = opts['width']
    let height    = opts['height']

    let xAxisType = 'D'
    if(dataset == 'WEO')
        xAxisType = 'Y' 

    let x, y, minYr, maxYr
    minYr = Date.now()
    maxYr = 0

    if(xAxisType == 'Y')
        x = ScaleUTC(opts['data'], width, margin)
    if(xAxisType == 'D')
        x = ScalePoint(opts['data'], width, margin)
    y = LinearAxisFormatter(opts['data'], height, margin)

    let showXAxis = true
    let showYAxis = true
    if("showXAxis" in opts)
        showXAxis = opts['showXAxis']
    if("showYAxis" in opts)
        showYAxis = opts['showYAxis']
    
    let maxNum, minNum = 0
    for(let i = 0; i < opts['data'].length; i++) {
        let data = opts['data'][i]
        if(data.value > maxNum)
            maxNum = data.value
        if(data.value < minNum)
            minNum = data.value
        if(data.date > maxYr)
            maxYr = data.date
        if(data.date < minYr)
            minYr = data.date
    }

    if(showXAxis && xAxisType == 'Y') {
        let stepValue = Math.round((maxYr - minYr) / 6)
        let tickRange = []
        tickRange.push(minYr)

        for(let i = 0; i < 7; i++) {
            let val = tickRange[i] + stepValue

            if(val >= maxYr) {
                tickRange.push(maxYr)
                break
            } else {
                tickRange.push(val)
            }
        }

        svg.append("g")
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format('d')).tickValues(tickRange))
    } else if(showXAxis && xAxisType == 'D') {
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
    }

    svg.append("path")
        .datum(opts['data'])
        .attr("fill", "none")
        .attr("stroke", "#456ef7")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", LinePath(x, y))
        .attr("transform", `translate(0, ${margin.top})`)
        .attr("clip-path", `url(#${opts['name']})`)
}

export default LineChart