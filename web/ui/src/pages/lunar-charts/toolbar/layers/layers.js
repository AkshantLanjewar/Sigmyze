import React, { useEffect, useState } from "react"

import Layer          from "./layer"
import LayerAccordion from "./accordion"

import { connect } from 'react-redux'
import { GetIndicator } from "../../../../data/server-interface"
import { RemoveIndicator } from "../../../../data/actions/projectActions"

/*
    [COMPONENT] -> Layers

    [param] indicators: list of indicators with barebones info
        1. indicator_id
        2. object_id
        3. dataset
    [param] remove_indicator: function that removes indicator based on 
        1. indicator_id
        2. object_id
*/

const Layers = ({ remove_indicator, project }) => {
    const [items, setItems] = useState([])
    let project_data = project.project_data
    let indicators   = project_data.indicators

    /*
        MAIN FUNCTION IN COMPONENT
        [description] -> Grabs all the fine details of the indicators

        [fetch] GetIndicator -> data: grabs all the fine details
            1. indicator_id
            2. object_id
            3. indicator_name
    */

    async function main() {
        let indicators_ = []
        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            let data      = await GetIndicator(indicator.dataset, indicator.object_id, indicator.indicator_id)
            data['object_id'] = indicator.object_id

            indicators_.push(data)
        }

        setItems([...indicators_])
    }

    useEffect(() => {
        main()
    }, [])

    // update the main function every time the indicator list changes
    useEffect(() => {
        main()
    }, [project])

    let accordionLayers = [
        {
            id: 'chart-elements',
            title: 'Chart Indicators',
            slot: (<div>{items.map((step) => ( <Layer layer={step} remove_indicator={remove_indicator} /> ))}</div>)
        }
    ]

    return (
        <div>
            <LayerAccordion items={accordionLayers} />
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project
})

const mapDispatchToProps = dispatch => ({
    remove_indicator: (iso3, ind3) => dispatch(RemoveIndicator(ind3, iso3)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Layers)