interface IChartDataset {
    dataset_id: string,
    type: string,
    data: Array<number>,

    label?: string,
    pointStyle?: string | boolean,
    tension?: number
}

interface IChartState {
    labels: Array<string>,
    datasets: Array<IChartDataset>
}

interface IChartLayout {
    padding: number,
    autoPadding: boolean
}

interface IChartGrid {
    display: boolean
}

interface IChartScale {
    display?: boolean
    grid?: IChartGrid
}

interface IChartScales {
    [key: string]: IChartScale
}

interface ILegendOptions {
    display?: boolean
}

interface ITooltipOptions {
    mode?: string
    position?: string
    intersect?: boolean,
    enabled?: boolean
}

interface ICrosshairLine {
    color?: string,
    width?: number,
    dashPattern: Number[]
}

interface ICrosshairZooming {
    enabled: boolean
}

interface ICrosshairSnap {
    enabled: Boolean
}

interface ICrosshairOptions {
    line?: ICrosshairLine,
    zoom?: ICrosshairZooming,
    snap?: ICrosshairSnap
}

interface IChartPlugins {
    legend?: ILegendOptions,
    tooltip?: ITooltipOptions,
    crosshair?: ICrosshairOptions
}

interface IChartInteractions {
    intersect?: boolean
}

interface IChartTooltips {
    enabled: boolean
}

interface IChartOptions {
    layout?: IChartLayout,
    scales?: IChartScales,
    plugins?: IChartPlugins,
    interaction?: IChartInteractions,
    tooltips?: IChartTooltips,

    maintainAspectRatio?: boolean
    animation?: boolean
}

export type {
    IChartDataset,
    IChartState,
    IChartLayout,
    IChartGrid,
    IChartScale,
    IChartOptions,
    IChartScales,
    ILegendOptions,
    IChartPlugins,
    ITooltipOptions,
    ICrosshairOptions,
    ICrosshairLine,
    ICrosshairZooming,
    IChartInteractions,
    ICrosshairSnap,
    IChartTooltips
}