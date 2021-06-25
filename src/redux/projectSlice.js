const projectReducer = (state = {}, action) => {
    switch(action.type) {
        case "OPEN_MODAL":
            return {
                ...state,
                modal_open: true
            }
        case "CLOSE_MODAL":
            return {
                ...state,
                modal_open: false
            }
        default:
            return state
    }
}

export default projectReducer