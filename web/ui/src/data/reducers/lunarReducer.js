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
                if(indicator.iso3 == payload.iso3 && indicator.ind3 == payload.ind3)
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