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
            object_id: iso3,
            indicator_id: ind3
        }
    }
}

export const ResetLunarIndicator = () => {
    return {
        type: "reset_indicators",
        payload: {}
    }
}