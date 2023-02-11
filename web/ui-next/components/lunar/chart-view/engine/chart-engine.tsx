import { useEffect, useRef, useState } from "react"
import styles from './chart-engine.module.scss'

import { Group } from '@visx/group'
import { ChartDims, IChartD3Scales, IChartData, IChartMargin, ILunarChart } from "./types"
import dynamic from "next/dynamic"

import { processCharts } from "./utils"
import D3Chart from "../d3-chart/d3-chart"
import D3Tooltip from "../d3-chart/d3-tooltip"
import D3TooltipBox from "../d3-chart/d3-tooltip-box"
import D3ChartTitle from "../d3-chart/title/d3-chart-title"
import { IGlobalChartSettings } from "../../../data/lunar/types/types"
import D3RenderTitle from "../d3-chart/title/d3-render-title"

const AxisBottom = dynamic(() => import('@visx/axis').then(({ AxisBottom }) => AxisBottom),
    { ssr: false }
);

interface IChartEngineProps {
    width: number,
    height: number,
    charts?: ILunarChart[],
    globals?: IGlobalChartSettings,
    display?: boolean
}

interface ITooltipState {
    tooltipOpen: boolean,
    tooltipLeft: number,
    tooltipTop: number,
    tooltipData?: IChartData[],
    vertLineLeft: number,
    longestIndex: number,
    chartArrays?: IChartData[][]
}

const defaultTooltipState = {
    tooltipOpen: false,
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipData: undefined,
    vertLineLeft: 0,
    longestIndex: 0
} as ITooltipState

const ChartEngine: React.FC<IChartEngineProps> = ({ width, height, charts, globals, display }) => {
    const ref = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const [scales, setScales] = useState<IChartD3Scales>({})
    const [boxDims, setBoxDims] = useState<ChartDims>({ x: 0, y: 0 })
    const [pathRefs, setPathRefs] = useState<any | null>({})
    const [tooltipData, setTooltipData] = useState<ITooltipState>(defaultTooltipState)

    const margin = { top: 20, right: 50, bottom: 30, left: 30 } as IChartMargin

    useEffect(() => {
        if(charts === undefined)
            return

        let dims = { 
            x: width - margin.left - margin.right, 
            y: height - margin.top - margin.bottom 
        } as ChartDims

        let resp = processCharts(charts, dims)
        setScales({ ...resp })
    }, [charts, width, height])

    useEffect(() => {
        const calcWidth = width - margin.left - margin.right
        const calcHeight = height - margin.top - margin.bottom

        setBoxDims({ x: calcWidth, y: calcHeight })
    }, [width, height])

    function setPathRef(ref?: any) {
        if(!ref) {
            setPathRefs(null)
            return
        }

        if(pathRefs === null)
            return
        let oPathRefs = pathRefs
        oPathRefs[ref.getAttribute('data-index')] = ref
        setPathRefs({ ...oPathRefs })
    }

    function closeTooltip() {
        setTooltipData({ ...defaultTooltipState })
    }

    return (
        <div ref={ref} style={{ width: width, height: height, position: 'relative' }}>
            {display
                ? (
                    <D3RenderTitle 
                        margin={margin}
                        indicators={scales.d3Charts}
                        tooltipData={tooltipData}
                        charts={charts}
                    />
                )
                : scales.d3Charts && scales.d3Charts.length > 0 && (
                    <D3ChartTitle
                        margin={margin}
                        globals={globals}
                        indicators={scales.d3Charts}
                        tooltipData={tooltipData}
                        charts={charts}
                    />
                )
            }

            <svg className={styles.svg} ref={svgRef}>
                <Group left={margin.left} top={margin.top}>
                    {scales.d3Charts && scales.d3Charts.map((step, i) => (
                        <D3Chart
                            showAxis={i === 0}
                            chart={step}
                            dims={boxDims}
                            timescale={scales.timescale!}
                            index={i}
                            setPathRef={setPathRef}
                        />
                    ))}

                    <D3Tooltip 
                        dims={boxDims}
                        charts={scales.d3Charts}
                        timescale={scales.timescale}
                        margin={margin}
                        pathRefs={pathRefs}

                        tooltipRef={tooltipRef.current}
                        tooltipData={tooltipData}
                        setTooltipData={setTooltipData}
                        closeTooltip={closeTooltip}

                    />

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

            <D3TooltipBox
                margin={margin}
                dims={boxDims}
                tooltipData={tooltipData}
                ref={tooltipRef}
                charts={scales.d3Charts}
            />
        </div>
    )
}

export type { ITooltipState }
export default ChartEngine
