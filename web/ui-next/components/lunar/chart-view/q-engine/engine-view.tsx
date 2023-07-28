import { Dispatch, RefObject, SetStateAction, memo } from "react"
import styles from '../engine/chart-engine.module.scss'
import { ChartDims, IChartD3Scales, IChartMargin, IQuantaChart } from "../engine/types"
import D3Tooltip, { ITooltipState } from "../d3-chart/d3-tooltip"
import QD3ChartTitle from "../quanta-d3-text/title"
import { IGlobalChartSettings } from "../../../data/lunar/types/chart-types"
import QD3RenderTitle from "../quanta-d3-text/render-title"
import { Group } from "@mantine/core"
import D3Chart from "../d3-chart/d3-chart"
import D3TooltipBox from "../d3-chart/d3-tooltip-box"
import dynamic from "next/dynamic"

const AxisBottom = dynamic(() => import('@visx/axis').then(({ AxisBottom }) => AxisBottom),
    { ssr: false }
);

interface IViewProps {
    ref: RefObject<HTMLDivElement>,
    svgRef: RefObject<SVGSVGElement>,
    tooltipRef: RefObject<HTMLDivElement>,
    width: number,
    height: number,
    display: boolean | undefined,
    margin: IChartMargin,
    scales: IChartD3Scales | undefined,
    tooltipData: ITooltipState,
    charts: IQuantaChart[] | undefined,
    globals: IGlobalChartSettings | undefined,
    boxDims: ChartDims,
    pathRefs: any,
    setPathRef(ref?: any): void
    setTooltipData: Dispatch<SetStateAction<ITooltipState>>,
    closeTooltip(): void
}

const QuantaEngineView: React.FC<IViewProps> = memo(({
    ref,
    svgRef,
    tooltipRef,
    width,
    height,
    display,
    margin,
    scales,
    tooltipData,
    charts,
    globals,
    boxDims,
    pathRefs,
    setPathRef,
    setTooltipData,
    closeTooltip
}) => (
    <>
        {scales && (
            <div ref={ref} style={{ width: width, height: height, position: 'relative' }}>
                {display
                    ? (
                        <QD3RenderTitle 
                            margin={margin}
                            indicators={scales.d3Charts}
                            tooltipData={tooltipData}
                            charts={charts}
                        />
                    )
                    : scales.d3Charts && scales.d3Charts.length > 0 && (
                        <QD3ChartTitle
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
        )}
    </>
))

export default QuantaEngineView