import { ChartDims, IChartData, IChartMargin, ID3Chart } from "../engine/types"
import { Dispatch, MouseEvent, RefObject, SetStateAction, TouchEvent, useRef, useState } from "react"
import { touchPoint, localPoint } from '@visx/event'
import { bisector, style } from "d3"
import { Group } from "@visx/group"
import moize from 'moize'
import { Motion, spring, presets } from "react-motion"
import { Line } from "@visx/shape"
import { v4 } from "uuid"
import D3Balls from "./title/d3-balls"
import { ITooltipState } from "../engine/chart-engine"

interface ID3TooltipProps {
    dims: ChartDims,
    charts?: ID3Chart[],
    timescale?: d3.ScaleTime<number, number, never>,
    margin?: IChartMargin,
    pathRefs?: any,

    tooltipRef: HTMLDivElement | null,
    tooltipData: ITooltipState,
    setTooltipData: Dispatch<SetStateAction<ITooltipState>>
    closeTooltip: Function
}

const GroupMem = moize.react(Group)

const D3Tooltip: React.FC<ID3TooltipProps> = 
    ({ dims, charts, timescale, margin, pathRefs, tooltipRef, tooltipData, setTooltipData, closeTooltip }) => {
    const ref = useRef<SVGRectElement>(null)
    
    const [selectorId, setSelectorId] = useState<string>(v4())
    const bisectDate = bisector((d: IChartData) => d.date).left

    function onMouseLeave(e: MouseEvent<SVGRectElement, globalThis.MouseEvent>): void {
        let target = e.target as any
        closeTooltip()
    }

    function onMouseMove(e: MouseEvent<SVGRectElement, globalThis.MouseEvent>) {
        if(ref === undefined)
            return

        const { x, y } = localPoint(ref.current!, e)!
        showTooltip(x, y)
    }

    function onTouchMove(e: TouchEvent<SVGRectElement>) {
        if(ref === undefined)
            return

        const { x, y } = touchPoint(ref.current!, e)!
        showTooltip(x, y)
    }

    function showTooltip(x: number, y: number) {
        //map through the data
        if(charts === undefined)
            return
        if(timescale === undefined)
            return
        if(margin === undefined)
            return
        if(tooltipRef === null)
            return
        
        //get the tooltipWidth
        let tooltipWidth = 140
        let tooltipBox = tooltipRef.getBoundingClientRect()
        tooltipWidth = tooltipBox.width

        //find the longest chart
        let longestIndex = 0
        for(let i = 0; i < charts.length; i++) {
            let chart = charts[i]
            if(chart.data.length > charts[longestIndex].data.length)
                longestIndex = i
        }

        const dataPoints = charts.map((chart) => {
            const xDomain = timescale.invert(x - margin.left)
            const index = bisectDate(chart.data, xDomain, 1)
            
            const leftData = chart.data[index - 1]
            const rightData = chart.data[index]
            if(leftData === undefined || rightData === undefined)
                return

            const isRightCloser = xDomain.getTime() - leftData.date.getTime() > rightData.date.getTime() - xDomain.getTime()
            return isRightCloser ? rightData : leftData
        })

        const dataArrays = charts.map((chart) => {
            return chart.data
        })

        //check if the points are out of bounds
        let activeDate = dataPoints[longestIndex] ? dataPoints[longestIndex]!.date : new Date() 
        for(let i = 0; i < dataPoints.length; i++) {
            let point = dataPoints[i]
            if(point === undefined)
                continue
            let date = point.date

            if(date.getTime() > activeDate.getTime() || date.getTime() < activeDate.getTime())
                dataPoints[i] = undefined
        }

        const xOffset = 18
        const yOffset = 18

        const posXWithOffset = x + xOffset
        const pastRightSide = posXWithOffset + tooltipWidth > dims.x
        const tooltipLeft = pastRightSide ? x - tooltipWidth - xOffset : posXWithOffset

        const tooltipTop = y - yOffset

        if(dataPoints[longestIndex] !== undefined)
            setTooltipData({
                tooltipOpen: true,
                tooltipData: dataPoints as IChartData[],
                tooltipLeft,
                tooltipTop,
                vertLineLeft: timescale(dataPoints[longestIndex]!.date),
                longestIndex: longestIndex,
                chartArrays: dataArrays
            })
    }

    return (
        <g>
            {margin && (
                <g>
                    <GroupMem>
                        {tooltipData.tooltipOpen && (
                            <g>
                                <D3Balls 
                                    tooltipState={tooltipData}
                                    pathRefs={pathRefs}
                                    charts={charts}
                                />

                                <Motion
                                    style={{
                                        left: spring(tooltipData.vertLineLeft || 0)
                                    }}
                                >
                                    {style => (
                                        <Line
                                            from={{ x: style.left, y: 0 }}
                                            to={{ x: style.left, y: dims.y }}
                                            stroke="white"
                                            opacity={0.1}
                                            strokeWidth={2}
                                        />
                                    )}
                                </Motion>
                            </g>
                        )}
                    </GroupMem>
                </g>
            )}

            <rect
                x={0}
                y={0}
                ref={ref}
                width={dims.x}
                height={dims.y}
                fill={"transparent"}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                onTouchMove={onTouchMove}
                z={"500"}
                data-idSelector={selectorId}
            />
        </g>
    )
}

export type { ITooltipState }
export default D3Tooltip