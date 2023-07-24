import { GetIndicator } from "../../data/datasets/DatasetsAPI";
import { IDatasetIndicator, IIndicator } from "../../data/datasets/DatasetsTypes";
import { IChartData, ILunarChart } from "./engine/types";
import { v4 as uuid } from 'uuid'
import { getIndicatorSetting, IChartSettings, IIndicatorSetting } from "../../data/lunar/types/types";
import { colorTsar } from "./engine/utils";
import { CompareIndicators } from "../../data/lunar/functions/functions";

function ParseSettings(
    nodeId: string, 
    charts: ILunarChart[], 
    getIndicatorSetting: getIndicatorSetting,
    createIndicatorSetting: Function
) {
    let nCharts = []
    for(let i = 0; i < charts.length; i++) {
        let chart = charts[i]
        let chart_settings = getIndicatorSetting(nodeId, chart.indicator)
        if(chart_settings === null) {
            //create the indicator setting
            let n_setting = {} as IIndicatorSetting
            n_setting.indicator = chart.indicator
            n_setting.lineColor = colorTsar()

            createIndicatorSetting(nodeId, n_setting)
            return charts
        }

        chart.setting = chart_settings
        nCharts.push(chart)
    }

    return nCharts 
}

function ParsePresentationSettings(charts: ILunarChart[], settings: IChartSettings) {
    let indicatorSettings = settings.indicatorSettings
    let nCharts = []
    for(let i = 0; i < charts.length; i++) {
        let chart = charts[i]

        for(let x = 0; x < indicatorSettings.length; x++) {
            let setting = indicatorSettings[x]
            if(CompareIndicators(chart.indicator, setting.indicator))
                chart.setting = setting
        }

        nCharts.push(chart)
    }

    return nCharts
}

async function FetchIndicators(indicators: IIndicator[]): Promise<ILunarChart[]> {
    let fetchedData = [] as IDatasetIndicator[]
    for(let i = 0; i < indicators.length; i++) {
        let indicator = indicators[i]
        let dataset   = indicator.dataset
        let object_id = indicator.object.object_id
        let indicator_id = indicator.indicator.indicator_id

        fetchedData.push((await GetIndicator(dataset, object_id, indicator_id)).indicator)
    }

    let charts = [] as ILunarChart[]
    for(let i = 0; i < fetchedData.length; i++) {
        let indicator = fetchedData[i]
        let iindicator = indicators[i]

        let i_data = indicator.indicator_data!
        let data = [] as IChartData[]

        for(let x = 0; x < i_data.length; x++) {
            let point = i_data[x]
            let chartData = {} as IChartData
            if(typeof point.value !== 'number')
                continue

            chartData.date = new Date(point.year!)
            chartData.value = point.value
            data.push(chartData)
        }

        let nChart = {} as ILunarChart
        nChart.data = data
        nChart.id = uuid()
        nChart.indicator = iindicator

        charts.push(nChart)
    }

    return charts
}

export { 
    FetchIndicators, 
    ParseSettings,
    ParsePresentationSettings 
}