import { LunarChart, LunarSeries } from './chart-data-def'
import * as echarts from "echarts"

export interface SeriesOptions {
    seriesName: string,
    seriesType: 'line' | 'bar',

    showXAxis: boolean,
    showYAxis: boolean,

    xAxisType: 'category' | 'time',
    yAxisType: 'value'

    yAxisPos: 'right' | 'left',

    xAxisData: Array<any>,
    yAxisData: Array<any>,
    smooth?: boolean
}

class ChartBuilder {
    options: LunarChart

    constructor() {
        this.options = this.initEmptyOptions()
    }

    BuildChart(container: HTMLDivElement) {
        let chart = echarts.init(container)
        chart.setOption(this.options)
    }

    AddSeries(options: SeriesOptions) {
        let xType = options.xAxisType
        let yData = options.yAxisData

        if(xType == 'category')
            this.options.xAxis.push({type: xType, show: options.showXAxis, data: options.xAxisData})
        if(xType == 'time') {
            let pairList = []

            for(let i = 0; i < options.xAxisData.length; i++)
                pairList.push([options.xAxisData[i], options.yAxisData[i]])
            yData = pairList
            this.options.xAxis.push({type: xType, show: options.showXAxis})
        }

        this.options.yAxis.push({
            type: options.yAxisType,
            position: options.yAxisPos,
            splitLine: {show: false},
            show: options.showYAxis
        })

        let series_options: LunarSeries = {
            name: options.seriesName,
            type: options.seriesType,
            data: yData,
            symbol: 'none',

            xAxisIndex: this.options.yAxis.length - 1,
            yAxisIndex: this.options.yAxis.length - 1,
        }

        if(options.seriesType == 'line') {
            series_options.smooth = options.smooth
            series_options.markPoint = {symbol: 'none'}
            series_options.lineStyle = {
                color: 'white',
                width: 4,
                cap: 'round'
            }
        }

        this.options.series.push(series_options)
    }    

    private initEmptyOptions(): LunarChart {
        return {
            title: {
                text: '',
                show: true
            },

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },

            legend: {
                show: false
            },

            xAxis: [],
            yAxis: [],
            series: []
        }
    }
}

export default ChartBuilder