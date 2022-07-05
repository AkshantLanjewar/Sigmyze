let default_state = {
    indicators: []
}

export default (state = default_state, action) => {
    let indicators = state.indicators
    let payload    = action.payload

    switch(action.type) {
        case "add_indicator":
            indicators.push(payload)
            return { indicators: [...indicators] }
        case "delete_indicator":
            let i_indicators = []
            for(let i = 0; i < indicators.length; i++) {
                let indicator = indicators[i]
                console.log(payload)

                if(indicator.object_id == payload.object_id && indicator.indicator_id == payload.indicator_id)
                    continue
                i_indicators.push(indicator)
            }

            return { indicators: [...i_indicators] }
        case "reset_indicators":
            return { indicators: [] }
        default: 
            return state
    }
}