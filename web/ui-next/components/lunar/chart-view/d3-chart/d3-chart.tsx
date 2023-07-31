import { LinePath } from '@visx/shape';
import dynamic from 'next/dynamic';
import { ChartDims, IChartData, ID3Chart } from '../engine/types'
import * as allCurves from '@visx/curve'
import moize from 'moize';
import { useEffect, useRef } from 'react';

const GridRows = dynamic(() => import('@visx/grid').then(({ GridRows }) => GridRows),
    { ssr: false }
);

const AxisRight = dynamic(() => import('@visx/axis').then(({ AxisRight }) => AxisRight),
    { ssr: false }
);

const LinePathMem = moize.react(LinePath)

interface ID3ChartProps {
    showAxis?: boolean,
    chart: ID3Chart,
    dims: ChartDims,
    timescale: d3.ScaleTime<number, number, never>,
    index: number,
    setPathRef?: Function
}

const D3Chart: React.FC<ID3ChartProps> = ({ chart, dims, showAxis, timescale, index, setPathRef }) => {
    const ref = useRef<SVGPathElement>(null)
    const GETXValue = (d: IChartData) => d.date
    const GETYValue = (d: IChartData) => d.value

    useEffect(() => {
        if(ref === null)
            return
        if(setPathRef === undefined)
            return

        setPathRef(ref.current)
    }, [])

    //calculate the settings
    const chartSettings = chart.setting
    let chartColor = chart.color

    if(chartSettings !== undefined) {
        let settingColor = chartSettings.lineColor
        if(settingColor !== undefined)
            chartColor = settingColor
    }

    return (
        <g>
            {showAxis === true && (
                <g>
                    <GridRows
                        scale={chart.rdScale}
                        width={dims.x}
                        height={dims.y}
                        stroke='#EDF2F7' 
                        strokeOpacity={0.05} 
                    />

                    <AxisRight
                        scale={chart.rdScale}
                        left={dims.x}
                        stroke={'#373A40'}
                        hideAxisLine
                        hideTicks
                        tickStroke={'#141517'}
                        strokeWidth={2}
                        tickLabelProps={() => ({
                            fill: '#EDF2F7',
                            fontSize: 12,
                            x: 12,
                            verticalAnchor: "middle",
                        })}
                    />
                </g>
            )} 

            <LinePathMem
                strokeWidth={2}
                shapeRendering={"geometricPrecision"}
                strokeLinejoin={"round"}
                strokeLinecap={"round"}
                curve={allCurves["curveCardinal"]}
                
                data-index={index}
                data={chart.data}
                stroke={chartColor}
                x={(d) => timescale(GETXValue(d)) ?? new Date()}
                y={(d) => chart.rdScale(GETYValue(d)!) ?? 0}
                innerRef={ref}
            />
        </g>
    )
}

export default D3Chart