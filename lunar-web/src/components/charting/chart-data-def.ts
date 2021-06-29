export interface LunarSeries {
    name: string,
    type: string,
    data: Array<Number>,
    smooth?: boolean,
    readonly symbol: 'none',
    xAxisIndex: Number,
    yAxisIndex: Number,

    markPoint?: {
        readonly symbol: 'none'
    },

    lineStyle?: {
        color: string,
        width: Number,
        readonly cap: 'round'
    }
}

export interface LunarChart {
    title: {
        text: string,
        show: boolean
    },

    readonly tooltip: {
        trigger: string,
        axisPointer: {
            type: string
        }
    },

    legend: {
        data?: Array<string>,
        readonly show: boolean
    },

    xAxis: Array<{data?: Array<any>, type: string, show?: boolean}>,

    yAxis: Array<{type?: string, show?: boolean, position: string, splitLine: {show: boolean}, max?: Number}>

    series: Array<LunarSeries>
}