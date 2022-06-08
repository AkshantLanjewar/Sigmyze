import * as d3 from 'd3'

import { ChartMargin } from '../chart-options'
import { SortDatasetsOutput } from './datasets'

interface TimeSeriesTimeScale {
    x: d3.ScaleTime<number, number, never>,
    step: number,
    ticks: Array<Date>
}

interface TimeScaleProps {
    sortedDatasets: SortDatasetsOutput,
    width: number,
    margin: ChartMargin
}

function TimeScale({ sortedDatasets, width, margin } : TimeScaleProps) {
    let output = {} as TimeSeriesTimeScale
    output.x   = d3.scaleTime()
        .domain(<[Date, Date]>d3.extent(sortedDatasets.longest_dataset, d => d.date))
        .range([margin.left, width - margin.right])

    //calculate ticks
    output.step  = Math.round(( sortedDatasets.max_date.getTime() - sortedDatasets.min_date.getTime() ) / 6)
    output.ticks = []
    output.ticks.push(sortedDatasets.min_date)
    for(let i = 0; i < 7; i++) {
        let val_t = output.ticks[i].getTime() + output.step
        let val_d = new Date(val_t)

        if(val_d.getTime() >= sortedDatasets.max_date.getTime()) {
            output.ticks.push(sortedDatasets.max_date)
            break
        } else {
            output.ticks.push(val_d)
        }
    }

    return output
}

interface LinearScaleProps {
    sortedDatasets: SortDatasetsOutput,
    height: number,
    margin: ChartMargin
}

interface TimeSeriesLinearScale {
    y: d3.ScaleLinear<number, number, never>,
    step: number,
    ticks: Array<number>
}

function LinearScale({ sortedDatasets, height, margin }: LinearScaleProps) {
    let output = {} as TimeSeriesLinearScale
    output.y   = d3.scaleLinear()
        .domain([sortedDatasets.min_value, sortedDatasets.max_value]).nice()
        .range([height, 0])

    output.step  = parseFloat(((sortedDatasets.max_value - sortedDatasets.min_value) / 20).toFixed(2))
    output.ticks = []
    output.ticks.push(sortedDatasets.min_value)
    for(let i = 0; i < 20; i++) {
        let val = parseFloat((output.ticks[i] + output.step).toFixed(2))

        if(val >= sortedDatasets.max_value) {
            output.ticks.push(sortedDatasets.max_value)
            break
        } else {
            output.ticks.push(val)
        }
    }

    return output
}

export { TimeSeriesTimeScale, TimeScale, TimeSeriesLinearScale, LinearScale }