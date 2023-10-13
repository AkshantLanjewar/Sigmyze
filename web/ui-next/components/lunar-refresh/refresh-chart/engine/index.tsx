import { scaleLinear, scaleTime } from '@visx/scale'
import styles from './index.module.scss'
import { ISigmyzeMargin } from './types'
import { extent } from '@visx/vendor/d3-array'
import { max } from 'd3-array'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { LinePath } from '@visx/shape'
import { curveBasis, curveCatmullRom, curveMonotoneX } from '@vx/curve'
import { Group } from '@visx/group'

interface IRefreshEngineProps {
    width: number,
    height: number
}

const RefreshEngine: React.FC<IRefreshEngineProps> = ({ width, height }) => {
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

    return (
        <div className={styles.engine__container}>
            <svg width={width} height={height}>
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
                    /> 
                </Group>
            </svg>
        </div>
    )
}

export default RefreshEngine