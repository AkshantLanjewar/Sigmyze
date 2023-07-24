import { v4 } from "uuid"
import { IChartSettings, IIndicatorSetting, getQuantaIndicatorSetting } from "../../data/lunar/types/types"
import { IQuantaIndicator } from "../../quanta/quanta-indicator-manager/types"
import { IQuantaIndicatorShell } from "../../ui/quanta-dataset-manager/types"
import { IChartData, ILunarChart, IQuantaChart } from "./engine/types"
import { colorTsar } from "./engine/utils"

const ParseQuantaSettings = (
    nodeId: string,
    charts: IQuantaChart[],
    getQuantaIndicatorSetting: getQuantaIndicatorSetting,
    createIndicatorSetting: Function
) => {
    let nCharts = [] as IQuantaChart[]
    for(let i = 0; i < charts.length; i++) {
        let chart = charts[i]
        if(chart.indicator.indicatorId === undefined)
            continue

        let indicatorShell: IQuantaIndicatorShell = {
            datasetId: chart.datasetId,
            indicatorId: chart.indicator.indicatorId
        }

        let chartSettings = getQuantaIndicatorSetting(nodeId, indicatorShell)
        if(chartSettings === null) {
            //create the indicator setting
            let nSetting = {} as IIndicatorSetting
            nSetting.quantaIndicator = indicatorShell
            nSetting.lineColor = colorTsar()

            createIndicatorSetting(nodeId, nSetting)
            return charts
        }

        chart.setting = chartSettings
        nCharts.push(chart)
    }

    return nCharts
}

const ParseQuantaPresentationSettings = (
    charts: IQuantaChart[],
    settings: IChartSettings
) => {
    let nCharts: IQuantaChart[] = []
    let indicatorSettings = settings.indicatorSettings
    for(let i = 0; i < charts.length; i++) {
        let chart = charts[i]
        for(let x = 0; x < indicatorSettings.length; x++) {
            let setting = indicatorSettings[x]
            if(setting.quantaIndicator?.datasetId === chart.datasetId && setting.quantaIndicator.indicatorId === chart.indicator.indicatorId)
                chart.setting = setting
        }

        nCharts.push(chart)
    }

    return nCharts
}

const FetchQuantaIndicators = async (
    indicators: IQuantaIndicatorShell[],
    fetchIndicator: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicator | undefined>
) => {
    let fetchedData: IQuantaIndicator[] = []
    for(let i = 0; i < indicators.length; i++) {
        let indicator = indicators[i]
        let datasetId = indicator.datasetId
        let indicatorId = indicator.indicatorId

        let fetchedIndicator = await fetchIndicator(datasetId, indicatorId)
        if(fetchedIndicator === undefined)
            continue

        fetchedData.push(fetchedIndicator)
    }

    let charts: IQuantaChart[] = []
    for(let i = 0; i < fetchedData.length; i++) {
        let fetchedIndicator = fetchedData[i]
        let indicatorShell = indicators[i]

        let indicatorData = fetchedIndicator.chartData
        let data: IChartData[] = []
        if(indicatorData === undefined)
            continue

        for(let x = 0; x < indicatorData.length; x++) {
            let point = indicatorData[x]
            if(point.xValue === undefined || point.yValue === undefined)
                continue

            data.push({
                date: new Date(point.xValue * 1000),
                value: point.yValue
            })
        }

        let newChart: IQuantaChart = {
            data: data,
            id: v4(),
            indicator: fetchedIndicator,
            datasetId: indicatorShell.datasetId
        }

        charts.push(newChart)
    }

    return charts
}

export {
    ParseQuantaSettings,
    ParseQuantaPresentationSettings,
    FetchQuantaIndicators
}