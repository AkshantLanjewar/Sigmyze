import { IIndicator } from "../../datasets/DatasetsTypes"

interface IGlobalChartSettings {
    chartTitle: string
}

interface IChartSettings {
    indicatorSettings: IIndicatorSetting[]
}

interface IIndicatorSetting {
    indicator: IIndicator,
    lineColor?: string    
}

export type {
    IGlobalChartSettings,
    IChartSettings,
    IIndicatorSetting
}