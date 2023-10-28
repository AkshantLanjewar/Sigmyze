import { scaleLinear, scaleTime } from '@visx/scale'
import styles from './index.module.scss'
import { ISigmyzeMargin } from './types'
import { extent } from '@visx/vendor/d3-array'
import { bisector, max } from 'd3-array'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { LinePath } from '@visx/shape'
import { curveBasis, curveCatmullRom, curveMonotoneX } from '@vx/curve'
import { Group } from '@visx/group'
import { Motion, spring } from 'react-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { localPoint, touchPoint } from '@visx/event'
import { getPathYFromX } from '../../../lunar/chart-view/engine/utils'

/**
     * NOTE: Need to replace data with Quanta compatible data
     */
const data = [
    { date: new Date(2017, 3, 1), value: 1 },
    { date: new Date(2017, 4, 1), value: 2 },
    { date: new Date(2017, 5, 1), value: 6 },
    { date: new Date(2017, 6, 1), value: 3 },
    { date: new Date(2017, 7, 1), value: 1 },
    { date: new Date(2017, 8, 1), value: 5 },
]

interface IRefreshEngineProps {
    width: number,
    height: number
}

const RefreshEngine: React.FC<IRefreshEngineProps> = ({ width, height }) => {
    //whether or not the tooltip is open
    const [tooltipOpen, setTooltipOpen] = useState(false)
    //the x position of the tooltip line
    const [lineLeftPos, setLineLeftPos] = useState<number>(0)
    //theese are the refs for the line-paths based on their rendered index
    const collectedLineRefs = useRef<{[key: number]: SVGPathElement | null}>({})
    //this is the ref for the chart container svg
    const refreshRef = useRef<SVGSVGElement>(null)
    //this is the cache for the getPath function
    const getPathCache = useRef<{[key: string]: number}>({})

    const series = [data]
    const allData = series.reduce((acc, arr) => acc.concat(arr), [])

    const margin: ISigmyzeMargin = {
        top: 20, 
        left: 40, 
        bottom: 25, 
        right: 45
    }

    const xMax = width - margin.left - margin.right
    const yMax = height - margin.top - margin.bottom

    const accessors = {
        xAccessor: (d: { date: Date, value: number }) => d.date,
        yAccessor: (d: { date: Date, value: number }) => d.value
    }

    const xScale = scaleTime<number>({
        range: [0, xMax],
        domain: extent(data, accessors.xAccessor) as unknown as [Date, Date]
    })

    const yScale = scaleLinear({
        range: [yMax, 0],
        domain: [0, 6]
    })

    const collectLineRef = useCallback((element: SVGPathElement | null, index: number) => {
        let collectedRefs = collectedLineRefs.current
        collectedRefs[index] = element

        collectedLineRefs.current = collectedRefs
    }, [])

    const getPathYFromXCB = useCallback((index: number, x: number) => {
        let collectedRefs = collectedLineRefs.current
        if(Object.keys(collectedRefs).includes(`${index}`) === false)
            return

        let pathRef = collectedRefs[index]
        if(pathRef === null)
            return

        let strIndex = `${index}`
        return getPathYFromX(x, pathRef, strIndex)
    }, [])

    //here are the functions for the tooltip
    const closeTooltip = useCallback(() => setTooltipOpen(false), [])
    const bisectDate = bisector((d:{ date: Date, value: number }) => new Date(d.date)).left

    const showTooltipAt = useCallback((x: number, y: number) => {
        const positionX = x - margin.left
        const positionY = y - margin.top

        if(positionX < 0 || positionX > xMax || positionY < 0 || positionY > yMax) {
            closeTooltip()
            return
        }

        //needs to be wrapped for multiple index's eventually
        const xDomain = xScale.invert(x - margin.left)
        const index = bisectDate(data, xDomain, 1)
        const dataPoint = data[index]

        setTooltipOpen(true)
        setLineLeftPos(xScale(new Date(dataPoint.date)))
    }, [xMax, yMax, margin, xScale])

    const tooltipMouseLeave = useCallback((e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        closeTooltip()
    }, [])

    const tooltipMouseMove = useCallback((e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        if(refreshRef.current === null)
            return

        const point = localPoint(refreshRef.current, e)
        if(point === null)
            return

        const {x, y} = point
        showTooltipAt(x, y)
    }, [showTooltipAt])

    const tooltipTouchMove = useCallback((e: React.TouchEvent<SVGRectElement>) => {
        if(refreshRef.current === null)
            return

        const point = touchPoint(refreshRef.current, e)
        if(point === null)
            return

        const {x, y} = point
        showTooltipAt(x, y)
    }, [showTooltipAt])

    useEffect(() => {
        let vertLineLeft = xScale(data[0].date)
        setLineLeftPos(vertLineLeft)
    }, [data])

    return (
        <div className={styles.engine__container}>
            <svg 
                width={width} 
                height={height}
                ref={refreshRef}
            >
                <rect x={0} y={0} width={width} height={height} fill="#101113" />

                <g data-testId={'chart-y-axis'}>
                    <AxisLeft
                        top={margin.top}
                        left={margin.left}
                        scale={yScale}
                        hideTicks
                        hideAxisLine
                        numTicks={3}
                        stroke="#909296"
                        tickFormat={yScale.tickFormat(3, "0")}
                        tickLabelProps={{
                            fill: "#909296",
                            fontSize: "12px",
                            textAnchor: "end",
                            fontWeight: "bold",
                            dy: "0.25em",
                            color: "#C1C2C5",
                            fontFamily: "Poppins"
                        }}
                    />
                </g>

                <g data-testId={'chart-x-axis'}>
                    <AxisBottom
                        top={height - margin.bottom}
                        left={margin.left}
                        scale={xScale}
                        hideTicks
                        stroke='#909296'
                        tickLabelProps={{
                            fill: "#909296",
                            fontSize: "12px",
                            textAnchor: "middle",
                            fontWeight: "bold",
                            dy: "0.25em",
                            color: "#C1C2C5",
                            fontFamily: "Poppins"
                        }}
                    />
                </g>

                <Group top={margin.top} left={margin.left}>
                    <LinePath
                        data={data}
                        x={(d) => xScale(d.date)}
                        y={(d) => yScale(d.value)}
                        curve={curveBasis}
                        strokeLinecap="round"
                        stroke='#5865f2'
                        shapeRendering="geometricPrecision"
                        innerRef={(e) => collectLineRef(e, 0)}
                    /> 

                    <Motion
                        defaultStyle={{ opacity: 0, x: lineLeftPos }}
                        style={{
                            opacity: spring(tooltipOpen ? 1 : 0),
                            x: spring(lineLeftPos)
                        }}
                    >
                        {(style) => {
                            const y = getPathYFromXCB(0, style.x)

                            return (
                                <g>
                                    <circle 
                                        cx={style.x}
                                        cy={y}
                                        r={12}
                                        fill='rgb(107, 157, 255)'
                                        stroke='rgb(107, 157, 255)'
                                        strokeWidth={0.6}
                                        fillOpacity={style.opacity / 12}
                                        strokeOpacity={style.opacity / 2}
                                    />

                                    <circle 
                                        cx={style.x}
                                        cy={y}
                                        r={4}
                                        fill="white"
                                        stroke='rgb(107, 157, 255)'
                                        strokeWidth={1.5}
                                        fillOpacity={style.opacity}
                                        strokeOpacity={style.opacity}
                                    />
                                </g>
                            )
                        }}
                    </Motion>

                    {xMax > 0 && (
                        <rect
                            x={0}
                            y={0}
                            width={xMax}
                            height={yMax}
                            fill='transparent'
                            onMouseLeave={(e) => tooltipMouseLeave(e)}
                            onMouseMove={(e) => tooltipMouseMove(e)}
                            onTouchMove={(e) => tooltipTouchMove(e)}
                        />
                    )}
                </Group>
            </svg>
        </div>
    )
}

export default RefreshEngine