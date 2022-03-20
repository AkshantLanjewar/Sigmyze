import React, { useEffect, useState } from "react"
import * as d3 from 'd3'

import GenerateLinePath from './types/line'
import YAxis from "./y-axis"
import XAxis from './x-axis'
import { GetIndicatorV } from '../../../data/indicator'

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
        bottom: 0,
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
            
            let tmpLinePaths = []
            for(let i = 0; i < chartList.length; i++) {
                let chart = chartList[i]

                //grab the data
                let data = await GetIndicatorV(chart['iso3'], chart['ind3'], chart['dataset'])
                
                let chart_return = {}
                let options = chartOptions
                options['dataset'] = chart['dataset']
                options['data']    = data['data'] 

                if(chart['type'] === 'line')
                    chart_return = GenerateLinePath(options)

                let path = chart_return['path']
                let y    = chart_return['y']
                let x    = chart_return['x']
                tmpLinePaths.push({ path: path, y: y, x: x, data: data['data'] })
            }

            setActiveAxis({ x: tmpLinePaths[0].x, 
                            y: tmpLinePaths[0].y, 
                            data: tmpLinePaths[0].data })
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
        setTooltipPosition({ x: activeAxis.x.x(data.data.date), y: ry })
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