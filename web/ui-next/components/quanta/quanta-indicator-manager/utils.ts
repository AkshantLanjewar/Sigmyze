import { IChartData, IQuantaIndicator } from "./types";

function validateChartData(chartData: IChartData[]) {
    for(let i = 0; i < chartData.length; i++) {
        let dataPoint = chartData[i]
        if(dataPoint.isProjection === undefined || dataPoint.xValue === undefined || dataPoint.yValue === undefined)
            return false
    }

    return true
}

function validateIndicator(indicator: IQuantaIndicator) {
    if(indicator.chartData === undefined || indicator.field === undefined)
        return false

    let indicatorField = indicator.field
    let fieldItems = indicatorField.datasetFields
    if(fieldItems === undefined)
        return false

    for(let i = 0; i < fieldItems.length; i++) {
        let fieldItem = fieldItems[i]
        if(fieldItem.fieldKey === undefined || fieldItem.fieldType === undefined)
            return false

        let fieldType = fieldItem.fieldType
        if(fieldType === "string" && fieldItem.stringField === undefined)
            return false
        if(fieldType === "date" && fieldItem.dateField === undefined)
            return false
    }

    let chartData = indicator.chartData
    if(chartData === undefined || validateChartData(chartData) === false)
        return false
    
    return true
}

export { 
    validateIndicator,
    validateChartData 
}