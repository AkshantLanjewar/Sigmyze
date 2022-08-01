import React, { useState, useEffect }   from "react"
import { Box } from "@mantine/core"

import { GetIndicator } from "../../../../data/server-interface"
import ParseWEOData     from "../../../../data/backend/weo-data"
import LunarChart       from "../../../../components/lunar-chart/chart"

const ChartView = ({ indicators, scale_change, tab }) => {
    const [data, setData]   = useState([])
    const [names, setNames] = useState([])

    const [, updateState] = React.useState();
    const forceUpdate     = React.useCallback(() => updateState({}), [])

    async function main() {
        let data_dict = {}
        let datasets  = []
        let names     = []

        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            
            let dataset = indicator.dataset
            let ind_id  = indicator.indicator_id
            let obj_id  = indicator.object_id

            let data           = await GetIndicator(dataset, obj_id, ind_id)
            let indicator_data = data.indicator_data
            indicator_data     = ParseWEOData(indicator_data)
            names.push(`${ind_id}: ${obj_id}`)

            for(let x = 0; x < indicator_data.length; x++) {
                let point = indicator_data[x]
                let date  = new Date(point['date'])
                let val   = point['value']

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
        setNames([...names])
        setData([...sorted_data])
    }

    useEffect(() => {
        main()
        forceUpdate()
    }, [indicators])

    useEffect(() => {
        main()
    }, [])

    return (
        <Box sx={{ height: '100%' }}>
            <LunarChart
                data={data}
                names={names}
                scale_change={scale_change}
            />
        </Box>
    )
}

export default ChartView