import { dark6, dark8 } from './color-palette'

class XAxis {
    ctx: CanvasRenderingContext2D
    axisWidth: number
    yAxisWidth: number
    canvasHeight: number
    canvasWidth: number

    constructor(ctx: CanvasRenderingContext2D, axisWidth: number, canvasHeight: number, canvasWidth: number, yAxisWidth: number) {
        this.ctx          = ctx
        this.axisWidth    = axisWidth
        this.canvasHeight = canvasHeight
        this.canvasWidth  = canvasWidth
        this.yAxisWidth   = yAxisWidth
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
    }
}

export default XAxis