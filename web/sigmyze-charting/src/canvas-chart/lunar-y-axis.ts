import { dark8, dark6 } from './color-palette'

class YAxis {
    ctx: CanvasRenderingContext2D
    axisWidth: number
    canvasHeight: number
    canvasWidth: number

    constructor(ctx: CanvasRenderingContext2D, axisWidth: number, canvasHeight: number, canvasWidth: number) {
        this.ctx          = ctx
        this.axisWidth    = axisWidth
        this.canvasHeight = canvasHeight
        this.canvasWidth  = canvasWidth
    }

    render() {
        this.ctx.fillStyle = dark8
        this.ctx.fillRect(this.canvasWidth - this.axisWidth, 0, this.axisWidth, this.canvasHeight)

        this.ctx.beginPath()

        this.ctx.lineCap = "square";
        this.ctx.moveTo(this.canvasWidth - this.axisWidth, 0)
        this.ctx.lineTo(this.canvasWidth - this.axisWidth, this.canvasHeight)

        this.ctx.strokeStyle = dark6
        this.ctx.stroke()
    }
}

export default YAxis