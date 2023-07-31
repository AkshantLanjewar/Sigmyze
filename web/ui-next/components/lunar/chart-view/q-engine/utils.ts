import * as d3 from 'd3'
import { ChartDims, IChartD3Scales, IChartData, ID3Chart, IQuantaChart } from "../engine/types"
import { colorTsar } from "../engine/utils"
import { IQuantaIndicatorText } from '../../../ui/quanta-dataset-manager/types'

const processQuantaCharts = async (
    charts: IQuantaChart[], 
    dims: ChartDims, 
    fetchIndicatorText: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicatorText | undefined>
) => {
    let unsortedLabels = [] as Date[]
    for(let i = 0; i < charts.length; i++) {
        let chart = charts[i]
        for(let x = 0; x < chart.data.length; x++) {
            let point = chart.data[x]
            let date = point.date

            if(unsortedLabels.includes(date) === false)
                unsortedLabels.push(date)  
        }
    }

    unsortedLabels.sort((a, b) => a.getTime() - b.getTime())
    const timeScale = d3
        .scaleTime()
        .domain(d3.extent(unsortedLabels) as [Date, Date])
        .range([0, dims.x])

    //patch the holes and build a y scale
    let d3Charts: ID3Chart[] = []
    for(let i = 0; i < charts.length; i++) {
        let chart = charts[i]
        let chartData = chart.data

        let indicatorId = chart.indicator.indicatorId
        let datasetId = chart.datasetId
        if(indicatorId === undefined)
            continue

        let color = colorTsar()
        let name = `${datasetId}::${indicatorId}`
        const GETYData = (d: IChartData) => d.value

        let indicatorText = await fetchIndicatorText(datasetId, indicatorId)
        if(indicatorText === undefined)
            continue

        name = indicatorText.short
        let valueAxis = d3
            .scaleLinear()
            .range([dims.y , 0])
            .domain(d3.extent(chartData, GETYData) as [Number, Number])
            .nice()

        d3Charts.push({
            data: chartData,
            type: "line",
            color: color,
            name: name,
            id: chart.id,
            rdScale: valueAxis,
            setting: chart.setting
        })
    }

    let response = {} as IChartD3Scales
    response.timescale = timeScale
    response.d3Charts = d3Charts

    return response
}

export { processQuantaCharts }