import YAxis         from "./lunar-y-axis"
import XAxis         from "./lunar-x-axis"
import TooltipBox    from "./tooltip-box"

import { dark9 } from "./color-palette"
import { ChartData, ChartMargin } from "../charts/chart-options"
import type { } from "css-font-loading-module"

import * as d3 from 'd3'

interface Chart {
    chart_type: "line",
    chart_data: Array<ChartData>
}

interface ChartCoords {
    x: number
    y: number
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
    fontLoaded: boolean
    totalDates: Array<Date>
    currentDate: Date

    chartMargin: ChartMargin
    yAxis: YAxis
    xAxis: XAxis
    tooltip: TooltipBox

    x: d3.ScaleTime<number, number, never>
    drawingCoords: Array<Array<ChartCoords>>

    cursorPos: ChartCoords
    hovered: boolean
    bisector: Function

    constructor(width: number, height: number, container: HTMLDivElement) {
        this.container = container
        this.canvas    = document.createElement("canvas")
        this.width     = width 
        this.height    = height
        this.ctx       = this.canvas.getContext("2d")!

        this.yAxisWidth    = 40
        this.xAxisHeight   = 40
        this.chartData     = []
        this.drawingCoords = []
        this.totalDates    = []
        this.currentDate   = new Date()

        let defaultMargin: ChartMargin = {} as ChartMargin
        defaultMargin.top    = 10
        defaultMargin.bottom = 10
        defaultMargin.left   = 10
        defaultMargin.right  = 10
        this.chartMargin     = defaultMargin
        this.fontLoaded      = false

        this.yAxis   = new YAxis(this.ctx, this.yAxisWidth, this.height, this.width)
        this.xAxis   = new XAxis(this.ctx, this.xAxisHeight, this.height, this.width, this.yAxisWidth, this.chartMargin)
        this.tooltip = new TooltipBox(this.ctx, { x: this.width - this.yAxisWidth, y: this.height })
        this.x       = d3.scaleTime()

        //append
        this.canvas.height = this.height
        this.canvas.width  = this.width
        this.canvas.id     = "lunar-main-chart"
        this.container.appendChild(this.canvas)
        
        this.cursorPos          = { x: 0, y: 0 } as ChartCoords
        this.hovered            = false

        this.bisector = d3.bisector(function(d: ChartData) { return d.date }).center
    }

    getWidth() {
        return this.width
    }

    getHeight() {
        return this.height
    }

    addDataset(data: Chart) {
        this.chartData.push(data)
        for(let i = 0; i < data.chart_data.length; i++)
            this.totalDates.push(data.chart_data[i].date)

        //remove duplicates
        let filtered_dates = this.totalDates.filter((c, index) => {
            return this.totalDates.indexOf(c) === index
        })
        this.totalDates = filtered_dates.slice().sort((a: Date, b: Date) => a.getTime() - b.getTime())
    }

    mouseOver(evt: MouseEvent) {
        let t_canvas = document.getElementById("lunar-main-chart")!
        var rect     = t_canvas.getBoundingClientRect()

        let pos  = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        } as ChartCoords

        this.cursorPos = pos
        this.hovered   = true
        if(pos.x >= this.width - this.yAxisWidth)
            this.hovered = false
        
        let x0    = this.x.invert(pos.x)
        let index = this.totalDates.reduce(function(prev, curr) {
            return (Math.abs(curr.getTime() - x0.getTime()) < Math.abs(prev.getTime() - x0.getTime()) ? curr : prev)
        })

        let nXPos = this.x(index)
        pos.x     = nXPos + this.chartMargin.left
        this.cursorPos = pos   
        
        if(this.currentDate != index) {
            this.currentDate = index
            this.draw()
        }
    }

    mouseOut() {
        this.cursorPos = { x: 0, y: 0 }
        this.hovered   = false

        this.draw()
    }

    update() {
        let t_canvas = document.getElementById('lunar-main-chart')!
        t_canvas.addEventListener('mouseover', (e) => {
            this.mouseOver(e)
        })

        t_canvas.addEventListener('mousemove', (e) => {
            this.mouseOver(e)
        })

        t_canvas.addEventListener('mouseout', (e) => {
            this.mouseOut()
        })

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
        let xVar = this.width - this.yAxisWidth - this.chartMargin.left - this.chartMargin.right
        let x = d3.scaleTime()
            .domain([min_date, max_date])
            .range([0, xVar])
        this.x = x
        this.xAxis.update(x)

        let yVar = this.height - this.xAxisHeight - this.chartMargin.bottom - this.chartMargin.top
        let y = d3.scaleLinear()
            .domain([min_val, max_val])
            .range([yVar, 0])
        
        for(let i = 0; i < this.chartData.length; i++) {
            let chart  = this.chartData[i]
            let c_data = chart.chart_data

            let drawCoords: Array<ChartCoords> = [] as Array<ChartCoords>
            for(let z = 0; z < c_data.length; z++) {
                let point              = c_data[z]
                let coord: ChartCoords = {} as ChartCoords

                coord.x = x(point.date) + this.chartMargin.left;
                coord.y = y(point.value) + this.chartMargin.top;
                drawCoords.push(coord)
            }

            this.drawingCoords.push(drawCoords)
        }
    }

    renderDrawCoords() {
        let d_coords = this.drawingCoords

        for(let i = 0; i < d_coords.length; i++) {
            let coords = d_coords[i]
            this.ctx.lineWidth = 2
            this.ctx.beginPath()
            this.ctx.lineCap = "square"

            for(let x = 0; x < coords.length; x++) {
                let coord = coords[x]
                if(x == 0)
                    this.ctx.moveTo(coord.x, coord.y)
                else
                    this.ctx.lineTo(coord.x, coord.y)
            }

            this.ctx.strokeStyle = "red"
            this.ctx.stroke()
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height)
        //render basic shapes and axis
        this.ctx.fillStyle = dark9
        this.ctx.fillRect(0, 0, this.width, this.height)

        this.xAxis.render()
        this.yAxis.render()

        this.renderDrawCoords()
        if(this.hovered) {
            this.xAxis.renderTooltip(this.cursorPos)
            this.tooltip.render(this.cursorPos, this.x)
        }        
    }

    render() {
        this.update()
        this.draw()
    }
}

export default LunarChart