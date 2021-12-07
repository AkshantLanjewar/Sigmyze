import * as uuid from "uuid"
import { CHART_OPTIONS, title, AxisOptions, GRID, Series, LineStyle, Tooltip } from './types'

class SChartBuilder {
    options: CHART_OPTIONS
    uID: string

    constructor() {
        this.options = {} as CHART_OPTIONS
        this.uID = uuid.v4()

        this.options.xAxis = []
        this.options.yAxis = []
        this.options.series = []

        let gridOpts: GRID = {} as GRID
        gridOpts.bottom = "3%"
        gridOpts.top = "2.5%"
        gridOpts.left = "0"
        gridOpts.right = "3%"

        gridOpts.show = false

        this.options.grid = gridOpts
    }

    SetTitle(text: string): void {
        let titleOptions: title = {
            id: this.uID + "-title",
            show: true,
            text: text,

            fontFamily: "Roboto",
            fontSize: 18
        }

        this.options.titleOptions = titleOptions
    }

    BuildChart() {
        return this.options
    }

    HideTitle(): void {
        if(this.options.titleOptions != undefined)
            this.options.titleOptions.show = false
    }

    SetTitleFont(fontsize: number) {
        if(this.options.titleOptions != undefined)
            this.options.titleOptions.fontSize = fontsize
    }

    BuildTooltip() {
        let tooltip: Tooltip = {} as Tooltip
        tooltip.show = true
        tooltip.trigger = 'axis'

        this.options.tooltip = tooltip
    }

    AddLineChart(series: Array<number>, xAxis: AxisOptions, yAxis: AxisOptions, name: string) {
        let defaultLineStyle: LineStyle = {} as LineStyle
        defaultLineStyle.width = 2
        defaultLineStyle.cap = 'round'
        defaultLineStyle.color = '#456ef7'
        defaultLineStyle.type = 'solid'

        let seriesOptions: Series = {} as Series
        seriesOptions.type = "line"
        seriesOptions.name = name
        seriesOptions.showSymbol = false
        seriesOptions.symbol = 'circle'
        seriesOptions.symbolSize = 4
        seriesOptions.lineStyle = defaultLineStyle
        seriesOptions.smooth = false
        seriesOptions.sampling = 'lttb'

        seriesOptions.data = series

        this.options.xAxis.push(xAxis)
        seriesOptions.xAxisIndex = this.options.xAxis.length - 1
        this.options.yAxis.push(yAxis)
        seriesOptions.yAxisIndex = this.options.yAxis.length - 1

        this.options.series.push(seriesOptions)
    }
}

export default SChartBuilder