import * as uuid from "uuid"
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

    HideTitle(): void {
        if(this.options.titleOptions != undefined)
            this.options.titleOptions.show = false
    }

    SetTitleFont(fontsize: number) {
        if(this.options.titleOptions != undefined)
            this.options.titleOptions.fontSize = fontsize
    }

    AddLineChart(series: XYData, xAxis: AxisOptions, yAxis: AxisOptions) {
        let seriesOptions: Series = {} as Series
    }
}

export default SChartBuilder