import * as d3 from 'd3'
import { ProcessSigmyzeData } from '../../../../components/charts/addons/data'
import { ScaleUTC, ScalePoint, LinearAxisFormatter } from '../../../../components/charts/addons/scales'

function GenerateLinePath(opts) {
    function LinePath(x, y) {
        let line = d3.line()
                    .defined(d => !isNaN(d.value))
                    .x(d => x(d.date))
                    .y(d => y(d.value))

        return line
    }

    let dataset = opts['dataset']
    let width   = opts['width']
    let height  = opts['height']
    let margin  = opts['margin']

    let xAxisType = 'Y'
    let x, y, minYr, maxYr, maxNum, minNum
    
    minYr  = 0
    maxYr  = 0
    maxNum = 0
    minNum = 0

    opts['data'] = ProcessSigmyzeData(opts['data'], dataset)

    for(let i = 0; i < opts['data'].length; i++) {
        let data = opts['data'][i]

        if(i == 0) {
            minNum = data.value
            minYr  = data.date
        }

        if(data.value > maxNum)
            maxNum = data.value
        if(data.value < minNum)
            minNum = data.value
        if(data.date > maxYr)
            maxYr = data.date
        if(data.date < minYr)
            minYr = data.date
    }

    if(xAxisType == 'Y')
        x = ScaleUTC(opts['data'], width, margin)
    if(xAxisType == 'D')
        x = ScalePoint(opts['data'], width, margin)
    y = LinearAxisFormatter(opts['data'], height, margin)

    //generate xAxisTicks
    let xStepValue = Math.round((maxYr - minYr) / 6)
    let xTickRange = []
    xTickRange.push(minYr)

    for(let i = 0; i < 7; i++) {
        let val = xTickRange[i] + xStepValue

        if(val >= maxYr) {
            xTickRange.push(maxYr)
            break
        } else {
            xTickRange.push(val)
        }
    }

    let xAxis = {
        x: x,
        tickRange: xTickRange,
        stepValue: xStepValue
    }

    //generate yAxisTicks
    let yStepValue = Math.round((maxNum - minNum) / 20)
    let yTickRange = []
    yTickRange.push(minNum)

    for(let i = 0; i < 20; i++) {
        let val = yTickRange[i] + yStepValue

        if(val >= maxNum) {
            yTickRange.push(maxNum)
            break
        } else {
            yTickRange.push(val)
        }
    }

    let yAxis = {
        y: y,
        tickRange: yTickRange,
        stepValue: yStepValue
    }

    let path = LinePath(x, y)
    return { path: path(opts['data']), y: yAxis, x: xAxis }
}

export default GenerateLinePath