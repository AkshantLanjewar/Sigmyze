import React, { useEffect, useState } from "react"
import _ from "underscore"

import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
    Resizable,
    styler
} from "react-timeseries-charts";

import { TimeSeries, TimeRange, IndexedEvent, Collection } from "pondjs";

let dummyData: Array<XYData> = [
    {date: new Date("2010"), value: 400},
    {date: new Date("2011"), value: 200},
    {date: new Date("2012"), value: 400},
    {date: new Date("2013"), value: 500},
    {date: new Date("2014"), value: 350},
    {date: new Date("2015"), value: 700},
    {date: new Date("2016"), value: 100},
    {date: new Date("2017"), value: 250},
    {date: new Date("2018"), value: 425},
    {date: new Date("2019"), value: 555},
    {date: new Date("2020"), value: 822},
    {date: new Date("2021"), value: 400},
    {date: new Date("2022"), value: 200},
    {date: new Date("2023"), value: 400},
    {date: new Date("2024"), value: 500},
    {date: new Date("2025"), value: 350},
    {date: new Date("2026"), value: 700},
    {date: new Date("2027"), value: 100},
    {date: new Date("2028"), value: 250},
    {date: new Date("2029"), value: 425},
]

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

function OverviewChart() {
    let points = []

    for(let i = 0; i < dummyData.length; i++) {
        let data = dummyData[i]

        let pair = []
        pair.push(data.date.getTime())
        pair.push(data.value)
        points.push(pair)
    }

    let series = new TimeSeries({
        name: "DummyData",
        columns: ["time", "value"],
        points
    })

    const [timerange, setTimerange] = useState(series.range())
    const style = styler([
        { key: "value", color: "steelblue", width: 3 }
    ])

    function handleTimeRangeChange(timerange) {
        setTimerange(timerange)
    }

    const [crosshairPos, setCrosshairPos] = useState({x: null, y: null, tracker: null})

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
            <Resizable>
                <ChartContainer
                    timeRange={timerange}
                    format="%b '%y"
                    maxTime={series.range().end()}
                    minTime={series.range().begin()}
                    enablePanZoom={true}
                    paddingTop={5}
                    onTimeRangeChanged={handleTimeRangeChange}
                    onMouseMove={((x, y) => {handleMouseMove(x, y)})}
                    onTrackerChanged={handleTrackerChange}
                >
                    <ChartRow height="795">
                        <Charts>
                            <LineChart 
                                axis="y" 
                                series={series}
                                style={style}
                                interpolation="curveBasis" 
                            />

                            <CrossHairs
                                x={crosshairPos.x}
                                y={crosshairPos.y}
                            />
                        </Charts>

                        <YAxis
                            id="y"
                            label="Chart"
                            hideAxisLine

                            style = {{ticks: { stroke: "none" }}}

                            width="30"
                            type="linear"
                            min={series.min()}
                            max={series.max()}
                        />
                    </ChartRow>
                </ChartContainer>
            </Resizable>
        </div>
    )
}

export default OverviewChart