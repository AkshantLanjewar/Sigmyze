import { ChartData, ChartOptions } from '../chart-options'

interface SortDatasetsOutput {
    min_value: number,
    max_value: number,
    min_date: Date,
    max_date: Date,

    longest_dataset: Array<ChartData>
}

function SortDatasets(datasets: Array<ChartOptions>) {
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

            if(value > output.max_value)
                output.max_value = value
        }
    }
}

export default SortDatasets