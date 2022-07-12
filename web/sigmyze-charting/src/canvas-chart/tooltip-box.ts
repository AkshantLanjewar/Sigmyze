import { dark1, dark6, dark7 } from "./color-palette"

interface ChartCoords {
    x: number
    y: number
}

class TooltipBox {
    boxWidth: number
    boxHeight: number
    canvasHeight: number
    canvasWidth: number

    ctx: CanvasRenderingContext2D
    
    constructor(ctx: CanvasRenderingContext2D, canvasDims: ChartCoords) {
        this.ctx       = ctx

        this.canvasHeight = canvasDims.y
        this.canvasWidth  = canvasDims.x
        this.boxHeight    = 125
        this.boxWidth     = 200
    }

    render(pos: ChartCoords, x: d3.ScaleTime<number, number, never>) {
        //determine position
        let x0   = x.invert(pos.x)

        let xPos = pos.x + 20
        if(xPos > this.canvasWidth / 2)
            xPos = pos.x - 20 - this.boxWidth

        this.ctx.fillStyle = dark7
        this.ctx.fillRect(xPos, 150, this.boxWidth, this.boxHeight)

        let options: Intl.DateTimeFormatOptions = {}
        options.month = 'long'
        options.day   = '2-digit'
        options.year  = 'numeric'
        let date_str  = x0.toLocaleDateString("en-US", options)

        this.ctx.font      = "14px Poppins"
        this.ctx.textAlign = "left"
        this.ctx.fillStyle = dark1
        this.ctx.fillText(date_str, xPos + 10, 175)
    }
}

export default TooltipBox