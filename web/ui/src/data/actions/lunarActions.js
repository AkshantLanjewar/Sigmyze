export const AddLunarIndicator = (payload) => {
    return {
        type: "add_indicator",
        payload: payload
    }
}

export const RemoveLunarIndicator = (ind3, iso3) => {
    return {
        type: "delete_indicator",
        payload: {
            iso3: iso3,
            ind3: ind3
        }
    }
}

export const ResetLunarIndicator = () => {
    return {
        type: "reset_indicators",
        payload: {}
    }
}