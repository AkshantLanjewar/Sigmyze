export const SetProjectName = (project_name) => {
    return {
        type: "set_project_name",
        payload: {
            project_name: project_name
        }
    }
}

export const SetProjectID = (project_id) => {
    return {
        type: "set_project_id",
        payload: {
            project_id: project_id
        }
    }
}

export const AddProjectIndicator = (indicator) => {
    return {
        type: "add_indicator",
        payload: indicator
    }
}

export const RemoveIndicator = (ind3, iso3) => {
    return {
        type: "remove_indicator",
        payload: {
            object_id: iso3,
            indicator_id: ind3
        }
    }
}

export const RemoveAllIndicators = () => {
    return {
        type: "remove_all_indicator",
        payload: {}
    }
}