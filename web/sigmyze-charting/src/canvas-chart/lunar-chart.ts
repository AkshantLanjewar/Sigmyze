import YAxis         from "./lunar-y-axis"
import XAxis         from "./lunar-x-axis"

import { dark9 } from "./color-palette"
import { ChartData } from "../charts/chart-options"

import * as d3 from 'd3'

interface Chart {
    chart_type: "line",
    chart_data: Array<ChartData>
}

class LunarChart {
    container: HTMLDivElement
    canvas: HTMLCanvasElement
    width: number
    height: number
    ctx: CanvasRenderingContext2D

    yAxisWidth: number
    xAxisHeight: number
    chartData: Array<Chart>

    yAxis: YAxis
    xAxis: XAxis

    constructor(width: number, height: number, container: HTMLDivElement) {
        this.container = container
        this.canvas    = document.createElement("canvas")
        this.width     = width 
        this.height    = height
        this.ctx       = this.canvas.getContext("2d")!

        this.yAxisWidth  = 40
        this.xAxisHeight = 40
        this.chartData   = []

        this.yAxis = new YAxis(this.ctx, this.yAxisWidth, this.height, this.width)
        this.xAxis = new XAxis(this.ctx, this.xAxisHeight, this.height, this.width, this.yAxisWidth)

        //append
        this.canvas.height = this.height
        this.canvas.width  = this.width
        this.container.appendChild(this.canvas)
    }

    getWidth() {
        return this.width
    }

    getHeight() {
        return this.height
    }

    addDataset(data: Chart) {
        this.chartData.push(data)
    }

    update() {
        let min_val = 0,
            max_val = 0
        let min_date = new Date(),
            max_date = new Date()

        for(let i = 0; i < this.chartData.length; i++) {
            let chart      = this.chartData[i]
            let chart_data = chart.chart_data

            for(let x = 0; x < chart_data.length; x++) {
                let data = chart_data[x]
                if(x == 0 && i == 0) {
                    min_val  = data.value
                    max_val  = data.value
                    min_date = data.date
                    max_date = data.date
                }

                let val  = data.value
                let date = data.date

                if(val > max_val)
                    max_val = val
                if(val < min_val)
                    min_val = val
                if(date.getTime() > max_date.getTime())
                    max_date = date
                if(date.getTime() < min_date.getTime())
                    min_date = date
            }
        }

        //generate the scales
        let x = d3.scaleTime()
            .domain([min_date, max_date])
            .range([0, this.width - this.yAxisWidth])
        let y = d3.scaleLinear()
            .domain([min_val, max_val])
            .range([this.height - this.xAxisHeight, 0])

    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.update()

        //render basic shapes and axis
        this.ctx.fillStyle = dark9
        this.ctx.fillRect(0, 0, this.width, this.height)

        this.xAxis.render()
        this.yAxis.render()
    }
}

export default LunarChart