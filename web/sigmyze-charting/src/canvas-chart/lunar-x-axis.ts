import { dark0, dark3, dark6, dark8 } from './color-palette'
import { ChartMargin } from '../charts/chart-options'

import * as d3 from "d3"

interface TickValue {
    tick: Date,
    xPos: number
}

interface ChartCoords {
    x: number
    y: number
}

class XAxis {
    ctx: CanvasRenderingContext2D
    axisWidth: number
    yAxisWidth: number
    canvasHeight: number
    canvasWidth: number
    ticks: Array<TickValue>
    margin: ChartMargin

    constructor(ctx: CanvasRenderingContext2D, axisWidth: number, canvasHeight: number, canvasWidth: number, yAxisWidth: number, margin: ChartMargin) {
        this.ctx          = ctx
        this.axisWidth    = axisWidth
        this.canvasHeight = canvasHeight
        this.canvasWidth  = canvasWidth
        this.yAxisWidth   = yAxisWidth
        this.ticks        = []
        this.margin       = margin
    }

    update(scale: d3.ScaleTime<number, number, never>) {
        this.ticks = []
        const tAxis = d3.axisRight(scale)
        // @ts-ignore
        const ticks = tAxis.scale().ticks()
        for(let i = 0; i < ticks.length; i++) {
            let tick  = ticks[i]
            let t_val = {} as TickValue

            t_val.tick = tick
            t_val.xPos = scale(tick) + this.margin.left
            this.ticks.push(t_val)
        }
    }

    renderTicks() {
        let options: Intl.DateTimeFormatOptions = {}
        options.month = 'long'
        options.day   = '2-digit'
        options.year  = 'numeric'

        this.ctx.font      = "12px Poppins"
        this.ctx.textAlign = "center"
        this.ctx.fillStyle = dark0

        for(let i = 0; i < this.ticks.length; i++) {
            let tick     = this.ticks[i]
            let tick_str = tick.tick.toLocaleDateString("en-US", options) 
            this.ctx.fillText(tick_str, tick.xPos, this.canvasHeight - (this.axisWidth / 2) + 5)
        }
    }

    renderTooltip(coords: ChartCoords) {
        this.ctx.beginPath()
        this.ctx.lineCap = "butt"
        this.ctx.strokeStyle = dark3
        this.ctx.setLineDash([12, 3, 3])

        this.ctx.moveTo(coords.x, 0)
        this.ctx.lineTo(coords.x, this.canvasHeight - this.axisWidth)
        this.ctx.stroke()
        this.ctx.setLineDash([])
    }

    render() {
        this.ctx.fillStyle = dark8
        this.ctx.fillRect(0, this.canvasHeight - this.axisWidth, this.canvasWidth - this.yAxisWidth, this.axisWidth)

        this.ctx.beginPath()
        
        this.ctx.lineCap = "square"
        this.ctx.moveTo(0, this.canvasHeight - this.axisWidth)
        this.ctx.lineTo(this.canvasWidth - this.yAxisWidth, this.canvasHeight - this.axisWidth)

        this.ctx.strokeStyle = dark6
        this.ctx.stroke()

        this.renderTicks()
    }
}

export default XAxis