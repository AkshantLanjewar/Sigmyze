interface ChartData {
    date: Date,
    value: number
}

interface ChartMargin {
    top: number,
    bottom: number,
    left: number,
    right: number
}

interface ChartOptions {
    id: string,
    type: string | "line",
    data: Array<ChartData>,
    color?: string,
    margin?: ChartMargin
}

interface Props {
    charts: Array<ChartOptions>,

    axisIndex?: number,
    margin: ChartMargin,

    verticalTooltip?: boolean,
    horizontalTooltip?: boolean,
    xAxis?: boolean,
    yAxis?: boolean
}

export  { ChartOptions, ChartData, ChartMargin }
export default Props