let default_state = {
    project_name: "",
    project_id: "demo",
    project_data: {
        indicators: []
    }
}

export default ( state = default_state, action ) => {
    let e_state    = state
    let payload    = action.payload
    let indicators = []

    switch(action.type) {
        case "set_project_name":
            e_state['project_name'] = payload.project_name
            return { ...e_state }
        case "set_project_id":
            e_state['project_id'] = payload.project_id
            return { ...e_state }
        case "add_indicator":
            let project_data = e_state['project_data']
            project_data['indicators'].push(payload)
            e_state['project_data'] = project_data

            return { ...e_state }
        case "remove_indicator":
            for(let i = 0; i < e_state.project_data.indicators.length; i++) {
                let indicator = e_state.project_data.indicators[i]

                if(indicator.object_id == payload.object_id && indicator.indicator_id == payload.indicator_id)
                    continue
                indicators.push(indicator)
            }

            e_state['project_data']['indicators'] = indicators
            return { ...e_state }
        case "remove_all_indicator":
            e_state['project_data']['indicators'] = indicators
            return { ...e_state }
        default: 
            return { ...e_state }
    }
}