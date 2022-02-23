import * as d3 from 'd3'
import { ScaleUTC, ScalePoint } from './scales'

function LineChart(opts, margin) {
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
        x = ScaleUTC(opts['data'], width)
    if(xAxisType == 'D')
        x = ScalePoint(opts['data'], width)
    
}

export default LineChart