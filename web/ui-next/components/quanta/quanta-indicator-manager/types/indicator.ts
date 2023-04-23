interface IQuantaIndicator {
    field?: IDatasetField,
    chartData?: IChartData[]
}

interface IDatasetField {
    datasetFields?: IDatasetFieldItem[]
}

interface IDatasetFieldItem {
    fieldKey?: string,
    fieldType?: string,
    stringField?: string,
    dateField?: number
}

interface IChartData {
    xValue?: number,
    yValue?: number,
    isProjection?: boolean
}

export type { 
    IQuantaIndicator,
    IDatasetField,
    IDatasetFieldItem,
    IChartData 
}