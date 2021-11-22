import { AxisOptions, LineStyle } from './types'

class BuildAxis {
    options: AxisOptions

    constructor() {
        this.options = {} as AxisOptions

        let defaultLineStyle = {} as LineStyle
        defaultLineStyle.color = "#333"
        defaultLineStyle.type = 'solid'
        defaultLineStyle.width = 1
        defaultLineStyle.cap = 'butt'

        //set defaults
        this.options.type = 'value'
        
        //axis line defaults
        this.options.axisLine.show = true
        this.options.axisLine.onZero = true
        this.options.axisLine.lineStyle = defaultLineStyle

        //axis tick defaults
        
    }

    SetAxisType(type: "value" | "category") {
        this.options.type = type
    }

    SetAxisData(data: Array<string> | Array<number>) {
        if(typeof data[0] == 'string' && this.options.type == "category")
            this.options.data = data
        if(typeof data[0] == 'number' && this.options.type == "value")
            this.options.data = data
    }

    HideAxisLine() {
        this.options.axisLine.show = false
    }

    SetOnZeroFalse() {
        this.options.axisLine.onZero = false
    }

    SetLineColor(color: string) {
        this.options.axisLine.lineStyle.color = color
    }

    SetLineWidth(width: number) {
        this.options.axisLine.lineStyle.width = width
    }

    SetLineType(type: 'solid' | 'dashed' | 'dotted') {
        this.options.axisLine.lineStyle.type = type
    }

    SetLineCap(type: 'butt' | 'round' | 'square') {
        this.options.axisLine.lineStyle.cap = type
    }

    HideAxisTick() {
        this.options.axisTick.show = false
    }

    AlignAxisTick() {
        this.options.axisTick.alignWithLabel = true
    }

    TickOnInside() {
        this.options.axisTick.inside = true
    }

    TickLength(length: number) {
        this.options.axisTick.length = length
    }

    TickLineType(type: 'solid' | 'dashed' | 'dotted') {
        this.options.axisTick.lineStyle.type = type
    }

    TickLineColor(color: string) {
        this.options.axisTick.lineStyle.color = color
    }

    TickLineWidth(width: number) {
        this.options.axisTick.lineStyle.width = width
    }

    TickLineCap(type: 'butt' | 'round' | 'square') {
        this.options.axisTick.lineStyle.cap = type
    }
}

export default BuildAxis