import * as d3 from "d3"
import React from "react"

import LineChart, { LineOptions } from './line-chart'

const blueColor = "#456ef7"
const redColor  = "#f14b61"

interface XYChartData {
    value: number,
    date: Date
}

interface ChartOptions {
    chartType: string,
    chartData: Array<XYChartData>
}

class ChartBuilder {
    container: React.RefObject<HTMLDivElement>
    chartTypes: Array<string>
    charts: Array<ChartOptions>

    constructor(container: React.RefObject<HTMLDivElement>) {
        this.container = container
        this.chartTypes = []
        this.charts = []
    }

    public AddChart(type: string) {
        this.chartTypes.push(type)
    }

    public CreateChart() {
        let boundingBox = this.container.current?.getBoundingClientRect()

        let margin = {top: 20, right: 10, bottom: 20, left: 10}

        let rawWidth = boundingBox?.width!
        let rawHeight = boundingBox?.height!

        let lineData = [
            { date: new Date("2007-04-23"), value: 200 },
            { date: new Date("2008-04-23"), value: 250 },
            { date: new Date("2009-04-23"), value: 450 },
            { date: new Date("2010-04-23"), value: 300 }
        ]

        let svg = d3.select(this.container.current)
            .append("svg")
                .attr("width", rawWidth)
                .attr("height", rawHeight)
                
        let x = d3.scaleUtc()
            .domain(<[Date, Date]>d3.extent(lineData, d => d.date))
            .range([margin.left, rawWidth - margin.right])
        let y = d3.scaleLinear()
            .domain(<[number, number]>[0, d3.max(lineData, d => d.value)]).nice()
            .range([rawHeight - margin.bottom, margin.top])       


        for(var i = 0; i < this.chartTypes.length; i++) {
            let chartType = this.chartTypes[i]

            if(chartType == "line")
                LineChart(svg, lineData, x, y)
        }
    }
}

export default ChartBuilder