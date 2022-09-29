export const OpenCreateModal = (type) => {
    return {
        type: "set_create_modal",
        payload: {
            type: type,
            modal_state: true
        }
    }
}

export const CloseCreateModal = () => {
    return {
        type: "set_create_modal",
        payload: {
            type: 'folder',
            modal_state: false
        }
    }
}

export const ToggleDriveUpdate = () => {
    return {
        type: "toggle_update",
        payload: {}
    }
}

export const UpdateDrive = (folders, projects) => {
    return {
        type: "update_drive",
        payload: {
            folders: folders,
            projects: projects
        }
    }
}

export const ChangeDirectory = (folder_id) => {
    return {
        type: "change_directory",
        payload: {
            folder_id: folder_id
        }
    }
}