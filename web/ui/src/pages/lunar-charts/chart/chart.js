import React, { useEffect, useState } from "react"
import useStyles from "./chart.styles"
import { connect } from "react-redux"

import BuildData    from "./sub/data-builder"

import { FaMix } from 'react-icons/fa'
import { AiFillDatabase } from 'react-icons/ai'

import EditorTabs from './sub/editor-tab'

import { v4 as uuidv4 } from 'uuid'

/*
    CHART COMPONENT

    [param] indicators: list of indicators passed to component from redux
*/

let default_tab = [
    {
        name: 'Combined Chart',
        icon: <FaMix size={14} />,
        editable: false,
        type: 'chart',

        names: [],
        data: [],
        id: uuidv4()
    }
]

const Chart = ({ project, tabs, setTabs, openedTabs, setOpenedTabs, setHiddenTabs }) => {
    const { classes }       = useStyles()
    /*
        MAIN FUNCTION IN COMPONENT

        [param] ref: passes the chart ref to main so it can build its amchart

        [fetch] GetIndicator -> data: grabs all the indicator data, so it can be pushed to amcharts
        
    */
    async function main() {
        let data_package = await BuildData(project)
        let sorted_data  = data_package.data
        let indicators   = data_package.indicators
        let names        = data_package.names

        //create tabs
        let n_tabs   = []
        let h_tabs   = []
        let o_tabs   = openedTabs
        let root_tab = tabs[0]

        root_tab.names = names
        root_tab.data  = sorted_data
        n_tabs.push(root_tab)

        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            let ind_id    = indicator.indicator_id
            let obj_id    = indicator.object_id
            let chart_key = `${ind_id}: ${obj_id}`

            let payload = { indicator_id: ind_id, object_id: obj_id }
            if(!o_tabs.includes(payload)) {
                o_tabs.push(payload)

                let names = [`${ind_id}: ${obj_id}`]
                let data  = []

                for(let x = 0; x < sorted_data.length; x++) {
                    let point = sorted_data[x]
                    let date  = point['date']
                    let value = null
                    if(chart_key in point)
                        value = point[chart_key]

                    let pack        = { date: date }
                    pack[chart_key] = value
                    data.push(pack)
                }

                let n_tab = {
                    name: `${ind_id}: ${obj_id}`,
                    icon: <AiFillDatabase size={14} />,
                    editable: true,
                    type: 'chart',

                    names: names,
                    data: data,
                    id: uuidv4()
                }

                n_tabs.push(n_tab)
                h_tabs.push(n_tab)
            }
        }
        
        setTabs([...n_tabs])
        setHiddenTabs([...h_tabs])
        setOpenedTabs([...o_tabs])
    }

    function DeleteTab(id) {
        let n_tabs = []

        for(let i = 0; i < tabs.length; i++) {
            let tab = tabs[i]
            
            if(tab.id == id)
                continue
            n_tabs.push(tab)        
        }

        setTabs([...n_tabs])
    }

    useEffect(() => {
        main()
    }, [])

    useEffect(() => {
        main()
    }, [project])

    return (
        <div className={classes.container}>
            <EditorTabs tabs={tabs} deleteTab={DeleteTab} />
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project
})

const mapDispatchToProps = state => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Chart)