import React, { useEffect, useState } from "react"
import _ from "underscore"
import { HiPlus } from "react-icons/hi"
import { format } from "d3-format"

import Indicator from "../../../data/indicator";
import { scaleLinear } from "d3-scale";
import Legend from './legend'

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
                    <line style={style} x1={x} y1={0} x2={x} y2={this.props.height} />
                </g>
            );
        } else {
            return <g />;
        }
    }
}

function Normalize(val, min, max) {
    return (val - min) / (max - min);
}

function YEndTail(props) {
    let displayStyle = "flex"
    if(props.activeChartHover == false)
        displayStyle = "none"

    let min = props.min
    let max = props.max
    let tYpos = max - props.yPos

    let index = Number(Normalize(tYpos, min, max) * (props.ticks.length - 1)).toFixed(0)
    let val = props.ticks[index]

    return (
        <div className="yTail" style={{height: `790px`}}>
            <div className="tail" style={{transform: `translateY(${props.yPos - 12.5}px)`, display: displayStyle}}> {val} </div>
        </div>
    )
}

function XEndTail(props) {
    let displayStyle = "flex"
    if(props.activeChartHover == false)
        displayStyle = "none"

    let value = props.gVal
    let strVal = "swag"
    if(value !== null)
        strVal = value.getFullYear()
    return (
        <div className="xTail">
            <div className="tail" style={{transform: `translateX(${props.xPos - 23}px)`, display: displayStyle}}> {strVal} </div>
        </div>
    )
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
    const [chartMisc, setChartMisc] = useState({ min: 0, max: 0, style: styler([]), columns: [], dMax: 0, ticks: [] })
    const [lTracker, setLTracker] = useState(null)
    const [legendVal, setLegendVal] = useState({})
    const [activeChartHover, setActiveChartHover] = useState(false)
    const [units, setUnits] = useState({})
    const [timetick, setTimetick] = useState("")


    let unitsObj = {}
    let rUnits = ""

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
                let rData = data[0]['data']
                rUnits = rData['units']
                setTimetick(data[0]['data']['timetick'])

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
                unitsObj[`${iso3}-${ind3}`] = rUnits

                t_styler.push({
                    key: `${iso3}-${ind3}`,
                    width: 3,
                    color: indicator.color.hex
                })
            }

            years = years.sort()
            let points = []
            let dataColumns = Object.keys(tPoints)
            let cols = ['time']

            let min = 0
            let max = 0

            let pack = {}

            for(let i = 0; i < years.length; i++) {
                let year = years[i]
                let pPoints = [new Date(year)]

                for(let x = 0; x < dataColumns.length; x++) {
                    let col = dataColumns[x]
                    let row = tPoints[col]

                    if(year in row) {
                        pPoints.push(row[year])

                        if(i == 0)
                            pack[col] = row[year]

                        if(row[year] > max)
                            max = row[year]
                        if(row[year] < min)
                            min = row[year]
                    }
                    else {
                        if(i == 0)
                            pack[col] = row[year]

                        pPoints.push(null)
                    }
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

                const margin = 5
                const innerHeight = 0.95*(window.innerHeight)-100 - margin * 2 //row - margin * 2

                let rangeTop = margin
                let rangeBottom = innerHeight - margin
                let tScale = scaleLinear().domain([min, max]).range([rangeBottom, rangeTop]).nice()

                misc['dMax'] = tScale.ticks()[tScale.ticks().length - 1]
                misc['ticks'] = tScale.ticks()

                setChartMisc(misc)

                setEmpty(true)
                setChartLayout(["line"])
                setCrosshairPos({x: null, y: null, tracker: points[0][0]})
                setLegendVal(pack)
                setUnits(unitsObj)

            }
        }

        anon()
    }, [props.indicators])



    function handleTimeRangeChange(timerange) {
        setTimerange(timerange)
    }

    function handleTrackerChange(tracker) {
        if(!tracker) {
            setCrosshairPos({tracker: tracker, x: null, y: null})
            setActiveChartHover(false)
        }
        else {
            setActiveChartHover(true)
            setLTracker(tracker)
            setCrosshairPos({tracker: tracker, x: crosshairPos.x, y: crosshairPos.y})
            const f = format(",.2f")

            let index = indicatorSeries.bisect(tracker)
            let event = indicatorSeries.at(index)
            let indicators = props.indicators
            let pack = {}

            for(let i = 0; i < indicators.length; i++) {
                let indicator = indicators[i]
                let name = `${indicator.iso3}-${indicator.indicator}`
                //pack[name] = f(event.get(name))
                pack[name] = (event.get(name))
            }


            setLegendVal(pack)
        }
    }

    function handleMouseMove(x, y) {
        setCrosshairPos({x: x, y: y, tracker: crosshairPos.tracker})
    }


    return (
        <div className="overview-chart">
            <Legend indicators={props.indicators} values={legendVal} units = {units}/>

            {emptyIndicators
                ? (
                    <div>
                        <Resizable>
                            <ChartContainer
                                timeRange={timerange}
                                maxTime={indicatorSeries.range().end()}
                                minTime={indicatorSeries.range().begin()}
                                onTrackerChanged={(tracker) => {handleTrackerChange(tracker)}}
                                enablePanZoom={true}
                                onTimeRangeChanged={handleTimeRangeChange}
                                onMouseMove={(x, y) => handleMouseMove(x, y)}
                                >
                                    <ChartRow height={0.95*(window.innerHeight)-100}>
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
                                            format=".2s"
                                            width="45" />
                                    </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                )

                : (
                    <div className="add-indicator">
                        <h4>Splice & analyze different datasets</h4>
                        <br/><br/>
                        <h2>Currently you have not added any Indicators</h2>
                        <h4>Click the <span><HiPlus /></span> button on the left to add some</h4>
                    </div>
                )
            }
        </div>
    )
}

export default OverviewChart


//<XEndTail xPos={crosshairPos.x} activeChartHover={activeChartHover} gVal={lTracker} />
//<YEndTail yPos={crosshairPos.y} activeChartHover={activeChartHover} min={0} max={790} dMax={chartMisc.dMax} ticks={chartMisc.ticks}  />
