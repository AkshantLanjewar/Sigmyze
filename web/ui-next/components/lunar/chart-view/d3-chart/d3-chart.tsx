import { LinePath } from '@visx/shape';
import dynamic from 'next/dynamic';
import { ChartDims, IChartData, ID3Chart } from '../engine/types'
import * as allCurves from '@visx/curve'

const GridRows = dynamic(() => import('@visx/grid').then(({ GridRows }) => GridRows),
    { ssr: false }
);

const AxisRight = dynamic(() => import('@visx/axis').then(({ AxisRight }) => AxisRight),
    { ssr: false }
);

interface ID3ChartProps {
    showAxis?: boolean,
    chart: ID3Chart,
    dims: ChartDims,
    timescale: d3.ScaleTime<number, number, never>
}

const D3Chart: React.FC<ID3ChartProps> = ({ chart, dims, showAxis, timescale }) => {
    const GETXValue = (d: IChartData) => d.date
    const GETYValue = (d: IChartData) => d.value

    return (
        <g>
            {showAxis === true && (
                <g>
                    <GridRows
                        scale={chart.rdScale}
                        width={dims.x}
                        height={dims.y - 200}
                        stroke='#EDF2F7' 
                        strokeOpacity={0.2} 
                    />

                    <AxisRight
                        scale={chart.rdScale}
                        left={dims.x}
                        stroke={'#141517'}
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

            <LinePath
                stroke="#4c6ef5"
                strokeWidth={2}
                shapeRendering={"geometricPrecision"}
                strokeLinejoin={"round"}
                strokeLinecap={"round"}
                curve={allCurves["curveCardinal"]}

                data={chart.data}
                x={(d) => timescale(GETXValue(d)) ?? new Date()}
                y={(d) => chart.rdScale(GETYValue(d)!) ?? 0}
            />
        </g>
    )
}

export default D3Chart