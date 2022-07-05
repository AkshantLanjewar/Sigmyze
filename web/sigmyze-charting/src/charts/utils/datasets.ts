import { ChartData, ChartOptions } from '../chart-options'

interface SortDatasetsOutput {
    min_value: number,
    max_value: number,
    min_date: Date,
    max_date: Date,

    longest_dataset: Array<ChartData>
}

function SortDatasets(datasets: Array<ChartOptions>): SortDatasetsOutput {
    let output = {} as SortDatasetsOutput
    
    //init_values
    output.min_value       = 0
    output.max_value       = 0
    output.min_date        = new Date()
    output.max_date        = new Date()
    output.longest_dataset = []

    for(let i = 0; i < datasets.length; i++) {
        let dataset = datasets[i]
        let data    = dataset.data

        if(data.length > output.longest_dataset.length || i == 0)
            output.longest_dataset = data

        for(let x = 0; x < data.length; x++) {
            let data_point = data[x]
            let value      = data_point.value
            let date       = data_point.date

            if(x == 0 && i == 0) {
                output.min_value = value
                output.max_value = value
                output.min_date  = date
                output.max_date  = date
            }

            if(value > output.max_value && !isNaN(value))
                output.max_value = value
            if(value < output.min_value && !isNaN(value))
                output.min_value = value
            if(date > output.max_date && !isNaN(value))
                output.max_date = date
            if(date < output.min_date && !isNaN(value))
                output.min_date = date
        }
    }

    output.min_date = new Date(output.min_date)
    output.max_date = new Date(output.max_date)
    return output
}

export { SortDatasetsOutput }
export default SortDatasets