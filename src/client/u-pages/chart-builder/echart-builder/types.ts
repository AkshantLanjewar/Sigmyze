type title = {
    id: string
    show: boolean
    text: string,

    fontFamily: string,
    fontSize: number,
}

type LineStyle = {
    color: string
    width: number
    type: 'solid' | 'dashed' | 'dotted',
    cap: 'butt' | 'round' | 'square'
}

type TickStyle = {
    show: boolean,
    alignWithLabel: boolean,
    inside: boolean,
    length: number,
    lineStyle: LineStyle
}

type AxisLineOptions = {
    show: boolean
    onZero: boolean,
    lineStyle: LineStyle
}

type AxisOptions = {
    type: "value" | "category"
    data: Array<string> | Array<number>,
    axisLine: AxisLineOptions,
    axisTick: TickStyle
}

type XYData = {
    date: Date,
    value: number
}

type Series = {
    type: string,
    name: string,

    xAxisIndex: number,
    yAxisIndex: number,

    //symbol
    showSymbol: boolean,
    symbol: 'emptyCircle' | 'circle' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none',
    symbolSize: number,

    smooth: boolean,
    sampling: string

    data: Array<number>
}

type CHART_OPTIONS = {
    titleOptions?: title,

    xAxis: Array<AxisOptions>,
    yAxis: Array<AxisOptions>,
    series: Array<Series>
}

export { title, AxisOptions, CHART_OPTIONS, LineStyle, XYData, Series, AxisLineOptions, TickStyle }