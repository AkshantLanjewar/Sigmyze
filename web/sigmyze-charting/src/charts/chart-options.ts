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
    type: "line",
    data: Array<ChartData>,
    color?: string
}

interface Props {
    charts: Array<ChartOptions>,

    axisIndex?: number,
    margin: ChartMargin
}

export  { ChartOptions, ChartData, ChartMargin }
export default Props