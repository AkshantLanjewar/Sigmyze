import * as d3 from "d3"
import React from "react"

import '../sass/chart.scss'

import LineChart, { LineOptions } from './line-chart'

export const blueColor = "#456ef7"
export const redColor  = "#f14b61"

interface XYChartData {
    value: number,
    date: Date
}

interface Margin {
    top: number,
    left: number,
    right: number,
    bottom: number
}

export interface ChartOptions {
    chartType: string,
    chartData: Array<XYChartData>,
    chartName: string,
    chartColor: string

    showXAxis: boolean,
    showYAxis: boolean,

    xAxisType: "utc",
    yAxisType: "linear"
}

class ChartBuilder {
    container: React.RefObject<HTMLDivElement>
    charts: Array<ChartOptions>
    axisIndex: number
    margin: Margin

    constructor(container: React.RefObject<HTMLDivElement>) {
        this.container = container
        this.charts = []
        this.axisIndex = 0

        this.margin = {
            top: 20, 
            right: 10,
            bottom: 20,
            left: 10
        }
    }

    public SetAxisIndex(index: number) {
        this.axisIndex = index
    }

    public AddLineChart(options: ChartOptions) {
        this.charts.push(options)
    }

    private UTCAxisFormatter(data: Array<XYChartData>, dimParam: number) {
        return d3.scaleUtc()
            .domain(<[Date, Date]>d3.extent(data, d => d.date))
            .range([this.margin.left, dimParam - this.margin.right])
    }

    private LinearAxisFormatter(data: Array<XYChartData>, dimParam: number) {
        return d3.scaleLinear()
            .domain(<[number, number]>[0, d3.max(data, d => d.value)]).nice()
            .range([dimParam - this.margin.bottom, this.margin.top])
    }

    public CreateChart() {
        if(this.charts.length == 0)
            return

        let boundingBox = this.container.current?.getBoundingClientRect()

        let rawWidth = boundingBox?.width!
        let rawHeight = boundingBox?.height!

        let width  = rawWidth - this.margin.right - this.margin.left
        let height = rawHeight - this.margin.top - this.margin.bottom 

        let svg = d3.select(this.container.current)
            .append("svg")
                .attr("width", rawWidth)
                .attr("height", rawHeight)
                
        let formatterOptions = this.charts[this.axisIndex]
        let x, y

        //do the x formatter
        if(formatterOptions.xAxisType == "utc")
            x = this.UTCAxisFormatter(formatterOptions.chartData, rawWidth)
        if(formatterOptions.yAxisType == "linear")
            y = this.LinearAxisFormatter(formatterOptions.chartData, rawHeight)
        
        //create the scales if applied
        if(formatterOptions.showXAxis) {
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(width / 50).tickSizeOuter(0))
        }
        
        if(formatterOptions.showYAxis) {
            svg.append("g")
                .attr("transform", `translate(${this.margin.left}, 0)`)
                .call(d3.axisLeft(y))
                .call(g => g.select('.domain').remove())
                .call(g => g.select(".tick:last-of-type text").clone()
                    .attr("x", 3)
                    .attr("text-anchor", "start")
                    .attr("font-weight", "bold")
                    .text(""))
        }
        
        for(let i = 0; i < this.charts.length; i++) {
            let chartOptions = this.charts[i]

            if(chartOptions.chartType == "line")
                LineChart(svg, chartOptions.chartData, x, y)
        }

        //add a tooltip
        let focus = svg.append("g")
            .attr('class', 'focus')
            .style('display', 'none')
        
        focus.append('line')
            .attr('class', 'hover-line')
            .attr('y1', 0)
            .attr('y2', height)
        
        svg.append('rect')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .on('mousemove', mousemove)
        
        function mouseover() {
            focus.style("display", null)
        }

        function mouseout() {
            focus.style("display", "none")
        }

        function mousemove() {

        }
    }
}

export default ChartBuilder