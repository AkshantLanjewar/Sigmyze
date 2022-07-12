import React, { useEffect, useState } from "react"
import useStyles from "./chart.styles"

import { useMantineTheme } from "@mantine/core"
import { GetIndicator } from '../../../data/server-interface'
import { connect } from "react-redux"

import LunarChart from "../../../components/lunar-chart/chart"
import { dummyLinearData } from '../../../data/dummy-data'
import ParseWEOData from "../../../data/backend/weo-data"

/*
    CHART COMPONENT

    [param] indicators: list of indicators passed to component from redux
*/

const Chart = ({ indicators }) => {
    const { classes }       = useStyles()
    const theme             = useMantineTheme()
    const [data, setData]   = useState({ names: [], data: [] })

    /*
        MAIN FUNCTION IN COMPONENT

        [param] ref: passes the chart ref to main so it can build its amchart

        [fetch] GetIndicator -> data: grabs all the indicator data, so it can be pushed to amcharts
        
    */
    async function main() {
        let datasets = []
        let names   = []

        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            let dataset   = indicator.dataset
            let ind_id    = indicator.indicator_id
            let obj_id    = indicator.object_id

            let data           = await GetIndicator(dataset, obj_id, ind_id)
            let indicator_data = data.indicator_data
            indicator_data     = ParseWEOData(indicator_data)
            names.push(ind_id)

            for(let x = 0; x < indicator_data.length; x++) {
                let data_point = indicator_data[x]
                
                let app_obj     = {}
                app_obj['date'] = new Date(data_point['date'])
                app_obj[ind_id] = data_point['value']
                if(i == 0)
                    datasets.push(app_obj)
                else {
                    let index = datasets.findIndex(x => x.date.getTime() === app_obj['date'].getTime())
                    if(index === -1)
                        datasets.push(app_obj)

                    let e_obj       = datasets[index]
                    e_obj[ind_id]   = data_point['value']
                    datasets[index] = e_obj
                }
            }
        }

        let sorted_data = datasets.slice().sort((a, b) => a.date.getTime() - b.date.getTime())
        setData({ names: names, data: sorted_data })
    }

    useEffect(() => {
        main()
    }, [])

    useEffect(() => {
        main()
    }, [indicators])

    return (
        <div className={classes.container}>
            <div className={classes.chart}>
                <LunarChart 
                    data={data.data} 
                    height={720}
                    names={data.names}
                />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    indicators: state.lunar.indicators
})

const mapDispatchToProps = state => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Chart)