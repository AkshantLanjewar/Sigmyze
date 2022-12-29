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

export const HideTab = (tab_id) => {
    return {
        type: "hide_tab",
        payload: {
            tab_id: tab_id
        }
    }
}

export const OpenChartTab = (dataset, object_id, indicator_id) => {
    return {
        type: "open_chart_tab",
        payload: {
            dataset: dataset,
            object_id: object_id,
            indicator_id: indicator_id
        }
    }
}

export const OpenDocumentTab = (document_name, data_location) => {
    return {
        type: "open_document_tab",
        payload: {
            document_name: document_name,
            data_location: data_location
        }
    }
}

export const OpenPublishingTab = (document_name, document_id) => {
    return {
        type: "open_publishing_tab",
        payload: {
            document_name: document_name,
            document_id: document_id
        }
    }
}

export const CreateDocument = (document_id, document_name, document_content, data_location) => {
    return {
        type: "add_document",
        payload: {
            document_id: document_id,
            document_name: document_name,
            document_content: document_content,
            data_location: data_location
        }
    }
}

export const RemoveDocument = (document_id, data_loc) => {
    return {
        type: "remove_document",
        payload: {
            document_id: document_id,
            data_loc: data_loc
        }
    }
}

export const SetDocumentContent = (blocks, document_location) => {
    return {
        type: "set_document_content",
        payload: {
            document_location: document_location,
            blocks: blocks
        }
    }
}

export const LoadProject = (name, id, indicators, documents) => {
    return {
        type: "load_project",
        payload: {
            project_name: name,
            project_id: id,
            indicators: indicators,
            documents: documents
        }
    }
}

export const DefaultProject = () => {
    return {
        type: "load_project",
        payload: {
            project_name: "",
            project_id: "demo",
            indicators: [],
            documents: []
        }
    }
}

export const RefreshUi = () => {
    return {
        type: "refresh_ui"
    }
}