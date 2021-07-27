import React from "react"

import './sass/chart.scss'

import * as d3 from 'd3'

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

    formatterPre: string

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

    //tooltip

    private SetupTooltip(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
        x: d3.ScaleTime<number, number, never>, 
        y: d3.ScaleLinear<number, number, never>,
        data: Array<XYChartData>,
        height: number) {

        const tooltip = svg.append('g')
            .attr('class', 'focus')
            .style('display', 'none')

        let line = tooltip.append('line')
            .attr('class', 'hover-line')
            .attr('y1', 0)
            .attr('y2', height)
        
        let charts = this.charts
        let chartCount = charts.length
        let yAxisCount = charts[this.axisIndex].chartData.length

        let longestCharLength = 0

        for(let i = 0; i < chartCount; i++) {
            let formatterString = charts[i].formatterPre

            if(i == 0)
                longestCharLength = formatterString.length
            if(formatterString.length > longestCharLength)
                longestCharLength = formatterString.length
        }

        longestCharLength = longestCharLength + 4
        let boxHeight  = chartCount * 30
        let boxWidth   = 10 * longestCharLength
        
        let tooltipText = tooltip.append("g")
            .attr('class', 'tooltip-container')
            .attr('width', boxWidth)
            .attr('height', boxHeight)

        let rect = tooltipText.append('rect')
            .attr('class', 'tooltip-chart')
            .attr('width', boxWidth)
            .attr('height', boxHeight)
            .attr('rx', 5)
            .attr('ry', 5)

        let fontOffset = 25  
        let textArray: Array<d3.Selection<SVGTextElement, unknown, null, undefined>> = []          
        for(let i = 0; i < chartCount; i++) {
            let tmpText = tooltipText.append("text")
                .text("swag")
                .attr('font-family', 'Inter')
                .attr('y', fontOffset)
                .attr('x', 10)
            
            textArray.push(tmpText)
            fontOffset += 22
        }

        function Bisect(mx: number): { data: XYChartData, direction: "left" | "right", index: number } {
            const bisect = d3.bisector(d => d.date).left
            const date   = x.invert(mx)
            const index  = bisect(data, date, 1)

            let direction: "left" | "right" = "right"

            if((yAxisCount / 2) < index)
                direction = "left"
            return { data: data[index - 1], direction: direction, index: index }
        }

        svg.on('mouseover', function() {
            tooltip.style("display", null);
        })

        svg.on('mouseout', function() {
            tooltip.style("display", 'none');
        })
        
        svg.on("touchmove mousemove", function(event) {
            const dataObj = Bisect(d3.pointer(event)[0])
            line.attr("transform", `translate(${x(dataObj.data.date)}, 0)`)

            let boxTransform: {x: Number, y: Number} = {
                x: 0,
                y: 0
            }

            if(dataObj.direction == "right")
                boxTransform = { x: x(dataObj.data.date) + 5, y: y(dataObj.data.value) }
            else if (dataObj.direction == "left")
                boxTransform = { x: x(dataObj.data.date) - (boxWidth + 5), y: y(dataObj.data.value) }
            
            rect.attr("transform", `translate(${boxTransform.x}, ${boxTransform.y})`)
            for(let i = 0; i < chartCount; i++) {
                textArray[i].attr("transform", `translate(${boxTransform.x}, ${boxTransform.y})`)
                textArray[i].text(charts[i].formatterPre + charts[i].chartData[dataObj.index - 1].value)
            }
        })
    }

    private ScaleUTC(data: Array<XYChartData>, dim: number) {
        return d3.scaleUtc()
            .domain(<[Date, Date]>d3.extent(data, d => d.date))
            .range([this.margin.left, dim - this.margin.right])
    }

    private LinearAxisFormatter(data: Array<XYChartData>, dimParam: number) {
        return d3.scaleLinear()
            .domain(<[number, number]>[0, d3.max(data, d => d.value)]).nice()
            .range([dimParam - this.margin.bottom, this.margin.top])
    }

    //chart types
    private LineChart(x: d3.ScaleTime<number, number, never>, y: d3.ScaleLinear<number, number, never>) {
        let line = d3.line<XYChartData>()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value))

        return line
    }

    public CreateChart() {
        if(this.charts.length == 0)
            return

        let options: ChartOptions = this.charts[this.axisIndex]
        let boundingBox = this.container.current?.getBoundingClientRect()

        const rawWidth  = boundingBox?.width
        const rawHeight = boundingBox?.height! - this.margin.top

        const svg = d3.select(this.container.current).append("svg")
            .attr("width", rawWidth!)
            .attr("height", rawHeight!)
            .style('overflow', 'visible')

        let x: d3.ScaleTime<number, number, never>
        let y: d3.ScaleLinear<number, number, never>

        if(options.xAxisType == "utc")
            x = this.ScaleUTC(options.chartData, rawWidth!)
        if(options.yAxisType == "linear")
            y = this.LinearAxisFormatter(options.chartData, rawHeight!)
        

        for(let i = 0; i < this.charts.length; i++) {
            const chartOptions = this.charts[i]

            if(chartOptions.chartType == "line")
                svg.append("path")
                    .datum(chartOptions.chartData)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 3)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("d", this.LineChart(x!, y!))
                    .attr("transform", `translate(0, ${this.margin.top})`)
        }

        this.SetupTooltip(svg, x!, y!, options.chartData, rawHeight!)
    }
}

export default ChartBuilder