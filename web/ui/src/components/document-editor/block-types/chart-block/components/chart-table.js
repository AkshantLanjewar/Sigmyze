import React, { useEffect, useState } from 'react'

import { 
    ScrollArea,
    Table,
    Checkbox,
} from '@mantine/core'

import { connect } from 'react-redux'
import { GetIndicator } from '../../../../../data/server-interface'

import MiniLunarChart  from '../../../../lunar-chart/mini-chart'
import ParseWEOData    from '../../../../../data/backend/weo-data'
import {HydrateChart} from "../../../../../pages/lunar-charts/document-hydration";

const ChartTable = ({ AddObject, RemoveObject, project }) => {
    const [toggled, setToggled] = useState(false)
    const [rows, setRows]       = useState([])
    const [checked, setChecked] = useState([])

    async function ProcessProject() {
        let checked    = []
        let indicators = project['project_data']['indicators']

        for(let i = 0; i < indicators.length; i++) {
            let indicator      = indicators[i]
            let indicator_data = await GetIndicator(indicator.dataset, indicator.object_id, indicator.indicator_id)

            let c_data   =  ParseWEOData(indicator_data.indicator_data)
            let names    = [`${indicator.indicator_id}: ${indicator.object_id}`]
            let datasets = []

            for(let i = 0; i < c_data.length; i++) {
                let data = c_data[i]
                let date = new Date(data['date'])
                let val  = data['value']

                let datasets_obj       = { date: date }
                datasets_obj[names[0]] = val
                datasets.push(datasets_obj)
            }

            let checked_object          = {}
            checked_object['id']        = `${i}-${indicator.indicator_id}-${indicator.object_id}`
            checked_object['checked']   = false
            checked_object['category']  = indicator_data.indicator_category
            checked_object['name']      = indicator_data.indicator_name
            checked_object['indicator'] = indicator 
            checked_object['data']      = datasets
            checked_object['names']     = names

            checked.push(checked_object)
        }

        setChecked([...checked])
    }

    useEffect(() => {
        ProcessProject()
    }, [project])

    function checkboxChange(check, id) {
        let checks = []
        for(let i = 0; i < checked.length; i++) {
            let check_obj = checked[i]

            if(check_obj.id == id) {
                check_obj['checked'] = check
                if(check_obj['checked'] == true)
                    AddObject(check_obj)
                if(check_obj['checked'] == false)
                    RemoveObject(check_obj.id)
            }

            checks.push(check_obj)
        }

        setChecked([...checks])
    }

    function extractCheckedLength() {
        let length = 0
        for(let i = 0; i < checked.length; i++) {
            let check = checked[i]
            if(check.checked)
                length += 1
        }

        return length
    }

    function toggleAll() {
        let checks = []
        for(let i = 0; i < checked.length; i++) {
            let check        = checked[i]
            check['checked'] = !toggled

            if(check['checked'] == true)
                AddObject(check)
            if(check['checked'] == false)
                RemoveObject(check.id)
            
            checks.push(check)
        }

        setChecked([...checks])
        setToggled(!toggled)
    }

    function checkedRun() {
        let table = []

        for(let i = 0; i < checked.length; i++) {
            let check = checked[i]

            let row   = (
                <tr key={`${i}-${check['id']}`}>
                    <td>
                        <Checkbox
                            checked={check.checked}
                            onChange={(event) => { checkboxChange(event.currentTarget.checked, check.id) }}
                        />
                    </td>

                    <td>{check.category}</td>
                    <td>{check.name}</td>
                    <td>{check.indicator.object_id}</td>
                    <td>{check.indicator.indicator_id}</td>

                    <td style={{ width: 100, height: 40, padding: 0, paddingBottom: 10, paddingTop: 10 }}>
                        <MiniLunarChart
                            data={check.data}
                            names={check.names}
                            usePadding={true}
                            paddingAmount={1}
                        />
                    </td>
                </tr>
            )

            table.push(row)
        }

        setRows([...table])
    }

    useEffect(() => {
        checkedRun()
    }, [checked])

    let checkLength = extractCheckedLength()

    return (
        <ScrollArea style={{ maxHeight: 300 }} mb={"xl"} pb={"xl"}>
            <Table verticalSpacing={"sm"}>
                <thead>
                    <tr>
                        <th style={{ width: 40 }}>
                            <Checkbox
                                onChange={toggleAll}
                                checked={checkLength == rows.length}
                                indeterminate={checkLength > 0 && checkLength != rows.length}
                                transitionDuration={250}
                            />
                        </th>

                        <th>Category</th>
                        <th>Indicator Name</th>
                        
                        <th>Object ID</th>
                        <th>Indicator ID</th>
                        <th>Preview</th>
                    </tr>
                </thead>

                <tbody>
                    {rows}
                </tbody>
            </Table>
        </ScrollArea>
    )
}

const mapStateToProps = state => ({
    project: state.project
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(ChartTable)