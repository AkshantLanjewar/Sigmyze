import { IQuantaIndicatorShell } from "../../../ui/quanta-dataset-manager/types"
import { IIndicator } from "../../datasets/DatasetsTypes"

interface IGlobalChartSettings {
    chartTitle: string
}

interface IChartSettings {
    indicatorSettings: IIndicatorSetting[]
}

interface IIndicatorSetting {
    indicator?: IIndicator,
    quantaIndicator?: IQuantaIndicatorShell
    lineColor?: string    
}

export type {
    IGlobalChartSettings,
    IChartSettings,
    IIndicatorSetting
}