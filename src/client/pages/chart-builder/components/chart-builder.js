import React, { useEffect, useState } from "react"
import * as d3 from 'd3'

import GenerateLinePath from './types/line'
import YAxis from "./axis/y-axis"
import XAxis from './axis/x-axis'
import { GetIndicatorV } from '../../../data/indicator'

//scales
import { ScaleUTC, LinearAxisFormatter } from './scales'

function ChartBuilder(props) {
    const chartList = props.charts
    const svgRef    = React.createRef()

    const [svgDims, setSvgDims]                 = useState({ width: 0, height: 0, paddedHeight: 0 })
    const [linePaths, setLinePaths]             = useState([])
    const [activeTooltip, setActiveTooltip]     = useState(false)
    const [activeAxis, setActiveAxis]           = useState({ x: null, y: null, data: [] })
    const [svgPoint, setSvgPoint]               = useState(null)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const [chartBuilt, setChartBuilt]           = useState(false)

    let margin = {
        top: 0,
        right: 5,
        bottom: 10,
        left: 5
    }

    useEffect(() => {
        async function main() {
            if(svgRef.current == null)
                return
            let boundingBox = svgRef.current.getBoundingClientRect()
            let point       = svgRef.current.createSVGPoint()

            const rawWidth   = boundingBox.width
            const rawHeight  = boundingBox.height - margin.top - margin.bottom
            let chartOptions = {
                width: rawWidth,
                height: rawHeight,
                margin: margin
            }

            setSvgDims({ width: rawWidth, height: boundingBox.height, paddedHeight: rawHeight })
            setSvgPoint(point)

            let data_points = []
            for(let i = 0; i < chartList.length; i++) {
                let chart = chartList[i]
                let data = await GetIndicatorV(chart['iso3'], chart['ind3'], chart['dataset'])
                data_points.push(data)
            }

            let longest_set_num = 0
            let longest_set

            let min_value = 0
            let max_value = 0
            let max_date  = 0
            let min_date  = 0

            for(let i = 0; i < data_points.length; i++) {
                let data    = data_points[i]
                let arr     = data['data']
                let arr_len = arr.length

                if(arr_len > longest_set_num || i == 0) {
                    longest_set_num = arr_len
                    longest_set = arr
                }

                for(let x = 0; x < arr.length; x++) {
                    let dp   = arr[x]
                    let val  = dp.value
                    let date = parseInt(dp.date)

                    if(x == 0 && i == 0) {
                        min_value = val
                        max_value = val
                        min_date  = date
                        max_date  = date
                    }

                    if(val > max_value)
                        max_value = val
                    if(val < min_value)
                        min_value = val
                    if(date < min_date)
                        min_date = date
                    if(date > max_date)
                        max_date = date
                }
            }

            //generate the scales now
            const x = ScaleUTC(longest_set, rawWidth, margin)
            const y = LinearAxisFormatter(min_value, max_value, rawHeight, margin)

            //generate the steps for x
            let xStepValue = Math.round((max_date - min_date) / 6)
            let xTickRange = []
            xTickRange.push(min_date)

            for(let i = 0; i < 7; i++) {
                let val = xTickRange[i] + xStepValue

                if(val >= max_date) {
                    xTickRange.push(max_date)
                    break
                } else {
                    xTickRange.push(val)
                }
            }

            //generate the steps for y
            let yStepValue = Math.round((max_value - min_value) / 20)
            let yTickRange = []
            yTickRange.push(min_value)

            for(let i = 0; i < 20; i++) {
                let val = yTickRange[i] + yStepValue

                if(val >= max_value) {
                    yTickRange.push(max_value)
                    break
                } else {
                    yTickRange.push(val)
                }
            }
            
            let tmpLinePaths = []
            
            let xPackage = {
                x: x,
                tickRange: xTickRange,
                stepValue: xStepValue
            }

            let yPackage = {
                y: y,
                tickRange: yTickRange,
                stepValue: yStepValue
            }


            //setup the paths
            for(let i = 0; i < data_points.length; i++) {
                let data = data_points[i]
                
                let options     = chartOptions
                options['x']    = xPackage
                options['y']    = yPackage
                options['data'] = data

                let path = GenerateLinePath(options)
                tmpLinePaths.push({ path: path, data: data['data'] })
            }

            setActiveAxis({ x: xPackage, 
                            y: yPackage, 
                            data: longest_set })
            setLinePaths(tmpLinePaths)
            setChartBuilt(true)
        }

        setTimeout(() => {
            main()
        }, 400)
    }, [chartList])

    function HandleMouseMove(event) {
        if(!chartBuilt)
            return
        const sX = d => d.date
        const X  = d3.map(activeAxis.data, sX)

        function CursorPoint(evt) {
            svgPoint.x = evt.clientX
            svgPoint.y = evt.clientY
            return svgPoint.matrixTransform(svgRef.current.getScreenCTM().inverse())
        }

        function Bisect(mx) {
            const date   = activeAxis.x.x.invert(mx)
            const index  = d3.bisectCenter(X, date)
            
            return { data: activeAxis.data[index], index: index }
        }

        const data = Bisect(d3.pointer(event)[0])
        let ry = CursorPoint(event).y
        setTooltipPosition({ x: activeAxis.x.x(data.data.date), y: ry, date: data.data.date })
    }

    function MouseOver() {
        if(!chartBuilt)
            return
        setActiveTooltip(true)
    }

    function MouseOut() {
        if(!chartBuilt)
            return
        setActiveTooltip(false)
    }

    return (
        <div className="chart-builder">
            <div className="chart-container">
                <svg 
                    ref={svgRef}
                    onTouchMove={HandleMouseMove}
                    onMouseMove={HandleMouseMove} 
                    onMouseOver={MouseOver} 
                    onMouseOut={MouseOut}>
                        <line
                            className="hover-line"
                            style={{ display: `${activeTooltip ? '' : 'none'}` }}
                            transform={`translate(${tooltipPosition.x}, 0)`}
                            y1={0}
                            y2={svgDims.height} />
                        <line
                            className="hover-line"
                            style={{ display: `${activeTooltip ? '' : 'none'}` }}
                            transform={`translate(0, ${tooltipPosition.y})`}
                            x1={0}
                            x2={svgDims.width} />

                        {linePaths.map((step) => (
                            <path
                                fill="none"
                                stroke="#456ef7"
                                strokeWidth={"2px"}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                transform={`translate(0, ${margin.top})`}
                                d={step.path}
                            />
                        ))}
                </svg>

                <XAxis activeAxis={activeAxis} activeTooltip={activeTooltip} tooltipPosition={tooltipPosition} />
            </div>

            <YAxis activeAxis={activeAxis} activeTooltip={activeTooltip} tooltipPosition={tooltipPosition}  />
        </div>
    )
}

export default ChartBuilder