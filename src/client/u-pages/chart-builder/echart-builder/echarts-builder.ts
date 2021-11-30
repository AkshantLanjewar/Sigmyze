import * as uuid from "uuid"
import React from "react"

import { init } from "echarts"
import type { ECharts } from "echarts"

import { CHART_OPTIONS, title, AxisOptions, XYData, Series } from './types'

class SChartBuilder {
    options: CHART_OPTIONS
    uID: string

    constructor() {
        this.options = {} as CHART_OPTIONS
        this.uID = uuid.v4()

        this.options.xAxis = []
        this.options.yAxis = []
        this.options.series = []
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

    AddLineChart(series: Array<number>, xAxis: AxisOptions, yAxis: AxisOptions, name: string) {
        let seriesOptions: Series = {} as Series
        seriesOptions.type = "line"
        seriesOptions.name = name

        //defaults
        seriesOptions.showSymbol = false
        seriesOptions.symbol = 'emptyCircle'
        seriesOptions.symbolSize = 4

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