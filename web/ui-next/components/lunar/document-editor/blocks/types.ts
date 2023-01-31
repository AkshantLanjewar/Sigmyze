import { IIndicator } from "../../../data/datasets/DatasetsTypes"
import { IChartSettings, IGlobalChartSettings } from "../../../data/lunar/types/chart-types"

interface ITextNode {
    type: string,
    value: string,
    id: string
}

interface IPresentationChart {
    node_id: string,
    indicators: IIndicator[],
    chartSettings: IChartSettings,
    chartGlobals: IGlobalChartSettings
}

export type { 
    ITextNode,
    IPresentationChart 
}