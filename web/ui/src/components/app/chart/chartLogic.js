import { GetIndicator } from "../data/datasets"

import {
    ScaleUTC,
    LinearAxisFormatter
} from './scales'

async function BuildCharts (
    chartList,
    svgRef, 
    margin,
    setFUNCS
) {
    const setSvgDims  = setFUNCS['setSvgDims']
    const setSvgPoint = setFUNCS['setSvgPoint']

    if(svgRef.current == null)
        return
    
    let boundingBox = svgRef.current.getBoundingClientRect()
    let svgPoint    = svgRef.current.createSVGPoint()

    const rawWidth  = boundingBox.width;
    const rawHeight = boundingBox.height - margin.top - margin.bottom

    setSvgDims({ width: rawWidth, height: rawHeight, paddedHeight: rawHeight })
    setSvgPoint(svgPoint)

    let data_points = []
    for(let i = 0; i < chartList.length; i++) {
        let chart = chartList[i]
        let data  = await GetIndicator(chart['dataset'], chart['iso3'], chart['ind3'])
        data_points.push(data)
    }

    //checks
    let longest_set_len = 0;
    let longest_set     = null  

    let min_val = 0
    let max_val = 0
    let max_dat = 0
    let min_dat = 0

    for(let i = 0; i < data_points.length; i++) {
        let data = data_points[i]
        let arr  = data_points['data']
        
        if(arr.length > longest_set_len || i == 0) {
            longest_set_len = arr.length
            longest_set     = arr
        }

        for(let x = 0; x < arr.length; x++) {
            let data_point = arr[x]
            let value      = data_point['value']
            let date       = data_point['date']

            if(x == 0 && i == 0) {
                min_val = value
                max_val = value
                min_dat = date
                max_dat = date
            }

            if(value > max_val)
                max_val = value
            if(value < min_val)
                min_val = value
            if(date > max_dat)
                max_dat = date
            if(date < min_dat)
                min_dat = date
        }
    }

    //create the scales
    const x = ScaleUTC(longest_set, rawWidth, margin)
    const y = LinearAxisFormatter(min_val, max_val, rawHeight, margin)

    //generate x steps
    let xStepValue = Math.round((max_dat - min_dat) / 6)
    let xTickRange = []
    xTickRange.push(min_dat)
    for(let i = 0; i < 7; i++) {

    }

    
}

export default BuildCharts