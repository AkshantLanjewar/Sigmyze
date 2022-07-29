import { GetIndicator } from '../../../../data/server-interface'
import ParseWEOData     from "../../../../data/backend/weo-data"

async function BuildData(project) {
    let project_data = project.project_data
    let datasets     = []
    let names        = []
    let indicators   = project_data.indicators

    let data_dict = {}

    for(let i = 0; i < indicators.length; i++) {
        let indicator = indicators[i]
        let dataset   = indicator.dataset
        let ind_id    = indicator.indicator_id
        let obj_id    = indicator.object_id

        let data           = await GetIndicator(dataset, obj_id, ind_id)
        let indicator_data = data.indicator_data
        indicator_data     = ParseWEOData(indicator_data)
        names.push(`${ind_id}: ${obj_id}`)

        for(let x = 0; x < indicator_data.length; x++) {
            let indicator = indicator_data[x]
            let date      = new Date(indicator['date'])
            let val       = indicator['value']

            if(!(date in data_dict))
                data_dict[date] = {}

            data_dict[date][`${ind_id}: ${obj_id}`] = val
        }
    }

    let keys = Object.keys(data_dict)
    for(let i = 0; i < keys.length; i++) {
        let slice = data_dict[keys[i]]
        
        for(let x = 0; x < names.length; x++) {
            let name = names[x]
            if(!(name in slice))
                slice[name] = null
        }

        slice['date'] = new Date(keys[i])
        datasets.push(slice)
    }

    let sorted_data = datasets.slice().sort((a, b) => a.date.getTime() - b.date.getTime())
    return { names: names, data: sorted_data, indicators: indicators }
}

export default BuildData