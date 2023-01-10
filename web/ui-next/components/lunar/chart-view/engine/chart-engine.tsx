import * as d3 from "d3"
import { useEffect, useRef, useState } from "react"
import styles from './chart-engine.module.scss'

import * as allCurves from '@visx/curve'
import { Group } from '@visx/group'
import { Line, LinePath } from '@visx/shape'
import { ChartDims, dummyData, IChartD3Scales, IChartData, IChartMargin, ILunarChart } from "./types"
import dynamic from "next/dynamic"
import { useTooltip } from '@visx/tooltip'
import { localPoint, touchPoint } from '@visx/event'
import { bisector } from "d3"

import { MouseEvent, TouchEvent } from "react"
import { Motion, spring, presets } from 'react-motion'
import { getPathYFromX, processCharts } from "./utils"
import D3Chart from "../d3-chart/d3-chart"

const AxisRight = dynamic(() => import('@visx/axis').then(({ AxisRight }) => AxisRight),
    { ssr: false }
);

const AxisBottom = dynamic(() => import('@visx/axis').then(({ AxisBottom }) => AxisBottom),
    { ssr: false }
);

interface IChartEngineProps {
    width: number,
    height: number,
    charts?: ILunarChart[]
}

const ChartEngine: React.FC<IChartEngineProps> = ({ width, height, charts }) => {
    const ref = useRef<HTMLDivElement>(null)
    const getX = (d: IChartData) => d.date
    const getY = (d: IChartData) => d.value
    const bisect = bisector((d: IChartData) => d.date).center

    const [dimensions, setDimensions] = useState({ height: 0, width: 0 })
    const [scales, setScales] = useState<IChartD3Scales>({})
    const [boxDims, setBoxDims] = useState<ChartDims>({ x: 0, y: 0 })

    const margin = { top: 40, right: 50, bottom: 40, left: 30 } as IChartMargin

    useEffect(() => {
        if(ref.current === null)
            return

        const bBox = ref.current.getBoundingClientRect()
        setDimensions({ width: bBox.width, height: bBox.height })
    }, [])

    useEffect(() => {
        if(charts === undefined)
            return

        let dims = { 
            x: width - margin.left - margin.right, 
            y: height - margin.left - margin.right 
        } as ChartDims

        let resp = processCharts(charts, dims)
        setScales({ ...resp })
    }, [charts])

    useEffect(() => {
        const calcWidth = width - margin.left - margin.right
        const calcHeight = height - margin.top - margin.bottom

        setBoxDims({ x: calcWidth, y: calcHeight })
    }, [width, height])

    return (
        <div ref={ref} style={{ width: "100%", height: "100%", position: 'relative' }}>
            <svg className={styles.svg}>
                <Group left={margin.left} top={margin.top}>
                    {scales.d3Charts && scales.d3Charts.map((step, i) => (
                        <D3Chart
                            showAxis={i === 0}
                            chart={step}
                            dims={boxDims}
                            timescale={scales.timescale!}
                        />
                    ))}

                    {scales.timescale && (
                        <AxisBottom
                            stroke={'#373A40'}
                            tickStroke={'#141517'}
                            strokeWidth={2}

                            orientation={'bottom'}
                            scale={scales.timescale}
                            top={boxDims.y}
                            hideTicks
                            tickLabelProps={() => ({
                                fill: '#EDF2F7',
                                fontSize: 12,
                                textAnchor: "middle"
                            })}
                        />
                    )}
                </Group>
            </svg>
        </div>
    )
}

export default ChartEngine
