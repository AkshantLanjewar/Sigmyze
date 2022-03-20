import * as d3 from 'd3'
import { ScaleUTC, ScalePoint, LinearAxisFormatter } from '../addons/scales'
import { ProcessSigmyzeData } from '../addons/data'

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
    opts['data'] = ProcessSigmyzeData(opts['data'], dataset)

    if(xAxisType == 'Y')
        x = ScaleUTC(opts['data'], width, margin)
    if(xAxisType == 'D')
        x = ScalePoint(opts['data'], width, margin)
    y = LinearAxisFormatter(opts['data'], height, margin)

    let showXAxis   = false
    let showYAxis   = false
    let sharedYAxis = false
    if("showXAxis" in opts)
        showXAxis = opts['showXAxis']
    if("showYAxis" in opts)
        showYAxis = opts['showYAxis']
    if("sharedYAxis" in opts)
        sharedYAxis = opts['sharedYAxis']
    
    let maxNum = 0
    let minNum = 0
    for(let i = 0; i < opts['data'].length; i++) {
        let data = opts['data'][i]
        if(i == 0)
            minNum = data.value

        if(data.value > maxNum)
            maxNum = data.value
        if(data.value < minNum)
            minNum = data.value
        if(data.date > maxYr)
            maxYr = data.date
        if(data.date < minYr)
            minYr = data.date
    }

    let yAxisOuptut, xAxisOutput

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

        xAxisOutput = svg.append("g")
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format('d')).tickValues(tickRange))
    } else if(showXAxis && xAxisType == 'D') {
        xAxisOutput = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
    }

    if(showYAxis) {
        const yAxis = d3.axisRight(y).ticks(height / 120)
        yAxisOuptut = svg.append("g")
            .attr("transform", `translate(${opts['width'] - margin['right']}, 0)`)
            .call(yAxis)
    }

    if(sharedYAxis) {
        let stepValue = Math.round((maxNum - minNum) / 8)
        let tickRange = []
        tickRange.push(minNum)

        for(let i = 0; i < 10; i++) {
            let val = tickRange[i] + stepValue

            if(val >= maxNum) {
                tickRange.push(maxNum)
                break
            } else {
                tickRange.push(val)
            }
        }

        if(opts['sharedState']['yFlagSet'] != true)
            opts['setSharedState']({ y: y, yTickRange: tickRange, stepSize: stepValue,  yFlagSet: true})
    }

    opts['monitor'].append("path")
        .datum(opts['data'])
        .attr("fill", "none")
        .attr("stroke", "#456ef7")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", LinePath(x, y))
        .attr("transform", `translate(0, ${margin.top})`)
        .attr("clip-path", `url(#${opts['name']})`)

    return { x: x, y: y, xAxisType: xAxisType }
}

export default LineChart