import { IChartData } from "./types"

interface ITooltipState {
    tooltipOpen: boolean,
    tooltipLeft: number,
    tooltipTop: number,
    tooltipData?: IChartData[],
    vertLineLeft: number,
    longestIndex: number,
    chartArrays?: IChartData[][]
}

export type { ITooltipState }
