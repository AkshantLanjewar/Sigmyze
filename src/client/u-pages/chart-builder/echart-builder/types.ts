type title = {
    id: string
    show: boolean
    text: string,

    fontFamily: string,
    fontSize: number,
}

type AxisOptions = {
    type: "value" | "category"
    data: Array<string> | Array<number>
}

type CHART_OPTIONS = {
    titleOptions?: title,
    xAxis: Array<AxisOptions>
}

export { title, AxisOptions, CHART_OPTIONS }