let default_state = {
    indicators: []
}

export default (state = default_state, action) => {
    switch(action.type) {
        case "indicators":
            let indicators = state.indicators
            indicators.push(action.payload)
            return { indicators: [...indicators] }
        default: 
            return state
    }
}