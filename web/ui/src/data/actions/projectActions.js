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

export const AddDocument = (document_id, document_name, document_content) => {
    return {
        type: "add_document",
        payload: {
            document_id: document_id,
            document_name: document_name,
            document_content: document_content
        }
    }
}

export const RemoveDocument = (document_id) => {
    return {
        type: "remove_document",
        payload: {
            document_id: document_id
        }
    }
}

export const HideTab = (tab_id) => {
    return {
        type: "hide_tab",
        payload: {
            tab_id: tab_id
        }
    }
}