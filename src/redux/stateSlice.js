const stateReducer = (state = {current_panel: "project_editor"}, action) => {
    switch(action.type) {
        case "SWITCH_DASHBOARD":
            return {
                ...state,
                current_panel: "project_dashboard"
            }
        case "SWITCH_EDITOR":
            return {
                ...state,
                current_panel: "project_editor"
            }
        default:
            return state
    }
}

export default stateReducer