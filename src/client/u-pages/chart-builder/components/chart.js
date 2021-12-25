import React, { useEffect, useState } from "react"
import _ from "underscore"
import { HiPlus } from "react-icons/hi"

import Indicator from "../../../data/indicator";

import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
    Resizable,
    styler
} from "react-timeseries-charts";

import { TimeSeries } from "pondjs";

class CrossHairs extends React.Component {
    render() {
        const { x, y } = this.props;
        const style = { pointerEvents: "none", stroke: "#ccc" };
        if (!_.isNull(x) && !_.isNull(y)) {
            return (
                <g>
                    <line style={style} x1={0} y1={y} x2={this.props.width} y2={y} />
                    <line style={style} x1={x} y1={0} x2={x} y2={this.props.height} />
                </g>
            );
        } else {
            return <g />;
        }
    }
}

let dummyPoints = new TimeSeries({
    name: "dummy",
    columns: ['time', 'value'],
    points: [[new Date("2000", 20)], [new Date("2001", 21)], [new Date("2002", 200)]]
})

function OverviewChart(props) {
    const [emptyIndicators, setEmpty] = useState(false)
    const [indicatorSeries, setIndicatorSeries] = useState(dummyPoints)
    const [timerange, setTimerange] = useState(dummyPoints.range())
    const [crosshairPos, setCrosshairPos] = useState({x: null, y: null, tracker: null})
    const [chartLayout, setChartLayout] = useState([])
    const [chartMisc, setChartMisc] = useState({ min: 0, max: 0, style: styler([]), columns: [] })

    useEffect(() => {
        async function anon() {
            let indicators = props.indicators
            let years = []
            let tPoints = {}

            let t_styler = []

            for(let i = 0; i < indicators.length; i++) {
                let indicator = indicators[i]
                let iso3 = indicator.iso3
                let ind3 = indicator.indicator

                let data = await Indicator.FindIndicator(iso3, ind3)
                let rData = data[0]
                let values = {}

                for(let i = 0; i < rData.data.length; i++) {
                    let iData = rData.data[i]
                    let date = iData.date
                    let value = iData.value

                    if(years.indexOf(date) == -1)
                        years.push(date)
                    values[date] = value
                }

                tPoints[`${iso3}-${ind3}`] = values
            }

            years = years.sort()
            let points = []
            let dataColumns = Object.keys(tPoints)
            let cols = ['time']

            let min = 0
            let max = 0

            for(let i = 0; i < dataColumns.length; i++) {
                let col = dataColumns[i]

                t_styler.push({
                    key: col,
                    width: 3,
                    color: "steelblue"
                })
            }

            for(let i = 0; i < years.length; i++) {
                let year = years[i]
                let pPoints = [new Date(year)]

                for(let x = 0; x < dataColumns.length; x++) {
                    let col = dataColumns[x]
                    let row = tPoints[col]

                    if(year in row) {
                        pPoints.push(row[year])
                        if(row[year] > max)
                            max = row[year]
                        if(row[year] < min)
                            min = row[year]
                    }
                    else
                        pPoints.push(null)
                }
                points.push(pPoints)
            }

            cols = cols.concat(dataColumns)
            let series = new TimeSeries({
                name: "line-chart",
                columns: cols,
                points
            })
            
            if(indicators.length !== 0) {
                setIndicatorSeries(series)
                setTimerange(series.range())

                let misc = {}
                misc['min'] = min
                misc['max'] = max
                misc['style'] = styler(t_styler)
                misc['columns'] = dataColumns

                setChartMisc(misc)

                setEmpty(true)
                setChartLayout(["line"])
            }
        }

        anon()
    }, [props.indicators])

    function handleTimeRangeChange(timerange) {
        setTimerange(timerange)
    }

    function handleTrackerChange(tracker) {
        if(!tracker)
            setCrosshairPos({tracker: tracker, x: null, y: null})
        else
            setCrosshairPos({tracker: tracker, x: crosshairPos.x, y: crosshairPos.y})
    }

    function handleMouseMove(x, y) {
        setCrosshairPos({x: x, y: y, tracker: crosshairPos.tracker})
    }

    return (
        <div className="overview-chart">
            {emptyIndicators
                ? (
                   <Resizable>
                       <ChartContainer
                          timeRange={timerange}
                          maxTime={indicatorSeries.range().end()}
                          minTime={indicatorSeries.range().begin()}
                          onTrackerChange={handleTrackerChange}
                          enablePanZoom={true}
                          onTimeRangeChanged={handleTimeRangeChange}
                          onMouseMove={(x, y) => handleMouseMove(x, y)}
                        >
                            <ChartRow height="800">
                                <Charts>
                                    {chartLayout.map((step) => {
                                        return (
                                            <LineChart
                                                axis="y"
                                                series={indicatorSeries}
                                                style={chartMisc.style}
                                                columns={chartMisc.columns}
                                                interpolation="curveBasis" />
                                        )
                                    })}

                                    <CrossHairs x={crosshairPos.x} y={crosshairPos.y} />
                                </Charts>

                                <YAxis
                                    id="y"
                                    min={chartMisc.min}
                                    max={chartMisc.max}
                                    width="60" />
                            </ChartRow>
                       </ChartContainer>
                   </Resizable>
                )

                : (
                    <div className="add-indicator">
                        <h2>Currently you havent added any Indicators</h2>
                        <h4>Click the <span><HiPlus /></span> button on the left to add some</h4>
                    </div>
                )
            }
        </div>
    )
}

export default OverviewChart