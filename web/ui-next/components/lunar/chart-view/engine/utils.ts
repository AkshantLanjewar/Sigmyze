import * as d3 from "d3";
import { Ref } from "react"
import { ChartDims, IChartD3Scales, IChartData, ID3Chart, ILunarChart } from "./types";

const pathYCache: any = {}

const CHART_COLORS = [ "#4263eb", "#7048e8", "#d6336c", "#f03e3e", "#0ca678" ]
let COLOR_INDEX = 0

function getPathYFromX(x: number, path: SVGPathElement, name: string, error?: any) {
    if(path === undefined)
        return 0
    const key = `${name}-${x}`;

    if (key in pathYCache) {
        return pathYCache[key];
    }

    error = error || 0.01;

    const maxIterations = 100;

    let lengthStart = 0;
    let lengthEnd = path.getTotalLength();
    let point = path.getPointAtLength((lengthEnd + lengthStart) / 2);
    let iterations = 0;

    while (x < point.x - error || x > point.x + error) {
        const midpoint = (lengthStart + lengthEnd) / 2;

        point = path.getPointAtLength(midpoint);

        if (x < point.x) {
            lengthEnd = midpoint;
        } else {
            lengthStart = midpoint;
        }

        iterations += 1;
        if (maxIterations < iterations) {
            break;
        }
    }

    pathYCache[key] = point.y

    return pathYCache[key]
}

function colorTsar() {
    COLOR_INDEX += 1
    if(COLOR_INDEX >= CHART_COLORS.length)
        COLOR_INDEX = 0

    return CHART_COLORS[COLOR_INDEX]
}

function processCharts(charts: ILunarChart[], dims: ChartDims): IChartD3Scales {
    let unsortedLables = [] as Date[]

    for(let i = 0; i < charts.length; i++) {
        let chart = charts[i]

        for(let x = 0; x < chart.data.length; x++) {
            let point = chart.data[x]
            let date  = point.date

            if(unsortedLables.includes(date) === false)
                unsortedLables.push(date)
        }
    }

    unsortedLables.sort((a, b) => a.getTime() - b.getTime())
    const timeScale = d3
        .scaleTime()
        .domain(d3.extent(unsortedLables) as [Date, Date])
        .range([0, dims.x])

    //patch holes and build y scale
    let d3Charts = [] as ID3Chart[]
    for(let i = 0; i < charts.length; i++) {
        let chart = charts[i]
        let chartData = chart.data

        let indicator = chart.indicator
        let color = colorTsar()
        let name = `${indicator.object.object_id}:${indicator.indicator.indicator_id}`

        const GETYData = (d: IChartData) => d.value
        let valueAxis = d3
            .scaleLinear()
            .range([dims.y , 0])
            .domain(d3.extent(chartData, GETYData) as [Number, Number])
            .nice()

        d3Charts.push({
            data: chartData,
            type: "line",
            color: color,
            name: name,
            id: chart.id,
            rdScale: valueAxis,
            setting: chart.setting
        })
    }

    let response = {} as IChartD3Scales
    response.timescale = timeScale
    response.d3Charts = d3Charts

    return response
}

export { 
    getPathYFromX,
    processCharts,
    colorTsar 
}