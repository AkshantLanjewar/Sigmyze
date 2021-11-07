import React from "react"

import * as d3 from 'd3'

export const blueColor = "#456ef7"
export const redColor  = "#F7456E"

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

    //data utils
    private Normalize(min: number, max: number, val: number) {
        if(min < 0) {
            max += 0 - min
            val += 0 - min
            min = 0
        }

        val = val - min
        max = max - min
        return Math.max(0, Math.min(1, val / max))
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
        let boxHeight  = (chartCount + 1) * 30
        if(chartCount == 1)
            boxHeight = (chartCount + 1.5) * 30
        let boxWidth   = 15 * longestCharLength
        
        let tooltipText = tooltip.append("g")
            .attr('class', 'tooltip-container')
            .attr('width', boxWidth)
            .attr('height', boxHeight)

        let rect = tooltipText.append('rect')
            .attr('class', 'tooltip-chart')
            .attr('width', boxWidth)
            .attr('height', boxHeight)
            .attr('rx', 3)
            .attr('ry', 3)

        let yTitle = tooltipText.append("text")
            .attr('font-family', 'Inter')
            .attr('y', 25)
            .attr('x', 10)
            .style('font-size', '12px')

        let fontOffset = 25 + 30 
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
            yTitle.attr("transform", `translate(${boxTransform.x}, ${boxTransform.y})`)
            yTitle.text(charts[0].chartData[dataObj.index - 1].date.toDateString())
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
            .domain(<[number, number]>[d3.min(data, d => d.value), d3.max(data, d => d.value)]).nice()
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
        const svg = d3.select(this.container.current).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .style('overflow', 'visible')
            .style('z-index', '99')

        let boundingBox = svg.node()?.getBoundingClientRect()
        const rawWidth  = boundingBox?.width
        const rawHeight = boundingBox?.height! - this.margin.top

        let clipPath = svg.append("defs")
            .append("clipPath")
            .attr("id", options.chartName )
            .append('rect')
            .attr("width", rawWidth!)
            .attr("height", rawHeight!)

        let x: d3.ScaleTime<number, number, never>
        let y: d3.ScaleLinear<number, number, never>

        if(options.xAxisType == "utc")
            x = this.ScaleUTC(options.chartData, rawWidth!)
        if(options.yAxisType == "linear")
            y = this.LinearAxisFormatter(options.chartData, rawHeight!)
        
        let maxNum = 0
        let minNum = 0

        for(let i = 0; i < this.charts.length; i++) {
            let chartOptions = this.charts[i]
            
            for(let x = 0; x < chartOptions.chartData.length; x++) {
                let chartData = chartOptions.chartData[x]
                if(chartData.value > maxNum)
                    maxNum = chartData.value
                if(chartData.value < minNum)
                    minNum = chartData.value
            }
        }

        for(let i = 0; i < this.charts.length; i++) {
            const chartOptions = this.charts[i]
            
            if(chartOptions.chartType == "line") {
                let yFormatter = this.LinearAxisFormatter(chartOptions.chartData, rawHeight!)

                svg.append("path")
                    .datum(chartOptions.chartData)
                    .attr("fill", "none")
                    .attr("stroke", chartOptions.chartColor)
                    .attr("stroke-width", 3)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("d", this.LineChart(x!, yFormatter!))
                    .attr("transform", `translate(0, ${this.margin.top})`)
                    .attr("clip-path", `url(#${options.chartName})`)
            }
        }

        this.SetupTooltip(svg, x!, y!, options.chartData, rawHeight!)
    }
}

export default ChartBuilder